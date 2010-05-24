class AccountController < ApplicationController
  before_filter :login_required
  before_filter :account
  
  def show
    
    @user = User.find(params[:id])
    @profile = @user.profile ||= Profile.new
    if current_user.id != @user.id
      flash[:notice] = "Unable to access account of another user"
      redirect_to account_url(:id=>current_user.id)
    end
    
  end

  def edit
    
  end
  
  def update_profile
    if current_user.profile.nil?
      profile = Profile.new(params[:profile])
      profile.user_id = current_user.id
      profile.save
      flash[:notice] = "Profile successfully updated"
      redirect_to :back
    else
      profile = current_user.profile
      profile.update_attributes(params[:profile])
      flash[:notice] = "Profile successfully updated"
      redirect_to :back
    end
  end
  
  private
  
  def account
    @current = "Account"
  end

end
