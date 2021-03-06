FactoryBot.define do
  factory :taxon_summary do
    sequence(:tax_id) { |n| n }
    count_type { "NT" }
    tax_level { 1 }
    mean { 0.5 }
    stdev { 1 }
    rpm_list { "[0,1] " }
    # NOTE: this conflicts with pipeline_report_service_spec.rb
    # association :taxon_lineage, factory: [:taxon_lineage]
  end
end
