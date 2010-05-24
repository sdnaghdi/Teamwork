class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.integer     :project_id
      t.text        :description
      t.integer     :user_id
      t.integer     :priority, :default => 0
      t.date        :deadline
      t.string      :state, :default => 'Waiting'
      t.string      :assigned_by
      t.integer     :hours_spent, :default => 0
      t.datetime    :start_time
      t.datetime    :end_time
      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
