class Profile < ActiveRecord::Base
  belongs_to :user
  
  def birthday
    if !self.dob.nil?
      return self.dob.strftime('%d/%m/%Y')
    else
      return '-'
    end
  end
  
end
