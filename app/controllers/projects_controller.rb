class ProjectsController < ApplicationController
  access_control [:new, :create, :update, :edit,:destroy] => '(Admin | Manager)'
  
  before_filter :login_required
  before_filter :project
  
  def index
    @projects = Project.all
  end
  
  def show
    @project = Project.find(params[:id])
  end
  
  def new
    @project = Project.new
  end
  
  def create
    @project = Project.new(params[:project])
    if !params[:project][:deadline].blank?
      deadline = params[:project][:deadline].split('.')
      @project.deadline = Date.new(deadline[2].to_i,deadline[1].to_i,deadline[0].to_i)
    end
    if @project.save
      flash[:notice] = "Successfully created project."
      redirect_to @project
    else
      flash[:error] = error_messages(@project)
      render :action => 'new'
    end
  end
  
  def edit
    @project = Project.find(params[:id])
    @deadline = @project.deadline.strftime('%d.%m.%Y')
  end
  
  def update
    @project = Project.find(params[:id])
    deadline = params[:project][:deadline].split('.')
    @project.deadline = Date.new(deadline[2].to_i,deadline[1].to_i,deadline[0].to_i)
    
    if @project.update_attributes(params[:project])
      flash[:notice] = "Successfully updated project."
      redirect_to @project
    else
      flash[:error] = error_messages(@project)
      render :action => 'edit'
    end
  end
  
  def destroy
    @project = Project.find(params[:id])
    @project.destroy
    flash[:notice] = "Successfully destroyed project."
    redirect_to project_url
  end
  
  private
  
  def project
    @current = 'Projects'
  end
  
end
