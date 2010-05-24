class HomeController < ApplicationController
  
  before_filter :login_required
  before_filter :overview
  
  def index
    @users = User.all
    init_google_cal
  end
  
  private
  
  def overview
    @current = 'Overview'
  end

end
