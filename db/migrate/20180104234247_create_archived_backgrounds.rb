class CreateArchivedBackgrounds < ActiveRecord::Migration[5.1]
  def change
    create_table :archived_backgrounds do |t|
      t.bigint :archive_of
      t.text :data

      t.timestamps
    end
  end
end
