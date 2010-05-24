class UsersController < ApplicationController
  access_control [:new, :create,:destroy] => '(Admin | Manager)'
  before_filter :login_required
  before_filter :users
  
  def index
    @users = User.all
  end
  
  def new
    @user = User.new
  end
  
  def show
    @user = User.find(params[:id])
  end
  
  def edit
    @user = User.find(params[:id])
    if current_user.id != @user.id && current_user.roles.first.title != 'Admin'
      flash[:notice] = "Unable to edit another member's account"
      redirect_to users_url
    end
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      flash[:notice] = "Successfully updated user."
      redirect_to :back
    else
      flash[:error] = error_messages(@user)
      redirect_to :back
    end
  end
  
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    flash[:notice] = "Successfully destroyed user."
    redirect_to user_url
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      flash[:notice] = "Member successfully created."
      redirect_to :back
    else
      flash[:error] = error_messages(@user)
      render :action => 'new'
    end
  end
  
  private
  
  def users
    @current = "Users"
  end
  
end
