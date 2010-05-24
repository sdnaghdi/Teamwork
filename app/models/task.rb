class Task < ActiveRecord::Base
      named_scope :in_progress, :include => 'project', :conditions => ['tasks.state = ? || tasks.state = ? AND projects.state = ?','waiting','working','Active'], :order => 'priority DESC'
      named_scope :overdue, :include => 'project', :conditions => ['CURDATE() > tasks.deadline AND projects.state = ?','Active'], :order => 'tasks.id DESC'
      named_scope :completed, :conditions => ['state = ?','completed']
      
      belongs_to  :user
      belongs_to  :project
      
      acts_as_state_machine :initial => :waiting
      
      validates_presence_of :description, :project_id, :user_id, :deadline
      
      state :waiting
      state :working
      state :completed
      state :cancelled

      event :work do
        transitions :from => :waiting, :to => :working
      end

      event :complete do
        transitions :from => :working, :to => :completed
      end

      event :cancelled do
        transitions :from => :waiting, :to => :cancelled
        transitions :from => :working, :to => :cancelled
        transitions :from => :completed, :to => :cancelled
      end
      
      def getIcon
        case priority
          when 0
            return "<span class='low'>Low</span>"
          when 1
            return "<span class='medium'>Medium</span>"
          when 2
            return "<span class='high'>High</span>"
          when 3
            return "<span class='din'>Now</span>"
            
        end 
      end
      
      def get_priority
        case priority
          when 0
            return "Low"
          when 1
            return "Medium"
          when 2
            return "High"
          when 3
            return "Now"
            
        end
      end
end
