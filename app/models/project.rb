class Project < ActiveRecord::Base
  named_scope :active, :conditions => ['state = ?','Active'], :order => 'id DESC'
  named_scope :inactive, :conditions => ['state = ?','Inactive'], :order => 'id DESC'
  has_many  :tasks
  acts_as_state_machine :initial => :active
  
  validates_presence_of :title, :description, :deadline
  
  state :active
  state :inactive

  event :activate do
    transitions :from => :inactive, :to => :active
  end

  event :deactivate do
    transitions :from => :active, :to => :inactive
  end
  
  def overdue_tasks(user = nil)
    if user.nil?
      return tasks.count(:conditions=>['CURDATE() > tasks.deadline'])
    else
      return tasks.find(:all, :conditions=>['user_id = ? AND CURDATE() > deadline',user.id]).size
    end
  end
  
  def tasks_count(user = nil)
    if user.nil?
      return tasks.count(:all)
    else
      return tasks.find(:all, :conditions=>['user_id = ?',user.id]).size
    end
  end
  
  def members
    members = []
    for task in self.tasks
      if !members.include? task.user
          members << task.user
      end
    end
    return members
  end
  
end
