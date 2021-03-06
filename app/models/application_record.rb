class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  # class instance var for caching
  @@mass_validation_enabled = nil # rubocop:disable Style/ClassVars

  # NOTE: Batch ActiveRecord operations such as update_all and delete_all do not
  # fire callbacks.
  after_create { |record| log_analytics record, "created" }
  after_update { |record| log_analytics record, "updated" }
  after_destroy { |record| log_analytics record, "destroyed" }

  before_save :log_errors, if: proc { |m| m.mass_validation_enabled? && m.errors.any? }

  def log_errors
    msg = errors.full_messages.join("\n")
    LogUtil.log_err(msg)
    Rails.logger.error("Backtrace:\n\t#{caller.join("\n\t")}")
  end

  # Condition for rollout of mass addition of validation rules.
  # Cached for performance.
  def mass_validation_enabled?
    @@mass_validation_enabled = (AppConfigHelper.get_app_config(AppConfig::ENABLE_MASS_VALIDATION) || false) if @@mass_validation_enabled.nil? # rubocop:disable Style/ClassVars
    @@mass_validation_enabled
  rescue StandardError
    # This will occur during CreateAppConfigTable migration
    @@mass_validation_enabled = false # rubocop:disable Style/ClassVars
  end

  # Set current user and request to global for use in logging.
  # See https://stackoverflow.com/a/11670283/200312
  class << self
    def _current_user=(user)
      Thread.current[:_current_user] = user
    end

    def _current_request=(request)
      Thread.current[:_current_request] = request
    end
  end

  private

  def _current_user
    Thread.current[:_current_user]
  end

  def _current_request
    Thread.current[:_current_request]
  end

  # See also ANALYTICS_EVENT_NAMES
  def log_analytics(record, action)
    # example: "visualization_updated"
    event = "#{record.class.name.underscore}_#{action}"

    properties = {
      # There should always be an id but just in case...
      id: record.respond_to?(:id) ? record.id : nil,
      # Add string name for convenience if available, except for people's names,
      # which are PII and thus prohibited from Google Analytics.
      name: record.respond_to?(:name) && record.class.name != :User ? record.name : nil,
      # Set common belongs_to IDs if available
      user_id: record.respond_to?(:user_id) ? record.user_id : nil,
      project_id: record.respond_to?(:project_id) ? record.project_id : nil,
      sample_id: record.respond_to?(:sample_id) ? record.sample_id : nil,
      pipeline_run_id: record.respond_to?(:pipeline_run_id) ? record.pipeline_run_id : nil,
    }

    # Merge status changes, important for updates, for example:
    # "status", "job_status", "command_status"
    properties = properties.merge(
      record.attributes.select { |k, _v| k.include?("status") }
    )

    # Remove empty keys
    properties = properties.delete_if { |_k, v| v.nil? }

    # log_analytics_event will never block
    MetricUtil.log_analytics_event(
      event,
      _current_user,
      properties,
      _current_request
    )
    Rails.logger.debug("Event '#{event}' logged with properties #{properties}")
  end
end
