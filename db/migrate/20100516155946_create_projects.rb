class CreateProjects < ActiveRecord::Migration
  def self.up
    create_table :projects do |t|
      t.string      :title
      t.date        :dateline
      t.string      :description
      t.string      :state, :default => 'Active'
      t.timestamps
    end
  end

  def self.down
    drop_table :projects
  end
end
