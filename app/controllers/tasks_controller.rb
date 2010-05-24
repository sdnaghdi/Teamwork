class TasksController < ApplicationController
  layout 'application', :except => [:create,:reload_gcal]
  before_filter :login_required
  before_filter :task
  
  def index
    @user = User.find(params[:id])
    @tasks = @user.tasks.in_progress
    @projects = []
    for task in @tasks
      if !@projects.include? task.project
        @projects << task.project
      end
    end
  end
  
  def show
    @task = Task.find(params[:id])
    @user = @task.user
  end
  
  def new
    @task = Task.new
  end
  
  def create
    @task = Task.new(params[:task])
    @task.assigned_by = current_user.username
    if !params[:task][:deadline].blank?
      deadline = params[:task][:deadline].split('.')
      @task.deadline = Date.new(deadline[2].to_i,deadline[1].to_i,deadline[0].to_i)
      google_date = deadline[0].to_s + "-" + deadline[1].to_s + "-" + deadline[2].to_s
    end
    if @task.save
      init_google_cal
      #Add to Google Calendar
      event = GCal4Ruby::Event.new(@service)
      event.calendar = @cal
      event.title = @task.user.username.capitalize+": "+shorten(@task.description,50)+" [#{@task.get_priority.capitalize}]"
      event.content = @task.description
      event.start_time = Time.parse("#{google_date} at 12:00 pm")
      event.end_time = Time.parse("#{google_date} at 12:00 pm")
      event.where = "-"
      event.reminder = [{:minutes => 2880, :method => 'alert'}]
      event.save
      
      render :update do |page|
        page.call 'growl', 'Task successfully created!'
        page.replace_html 'quick-task', :partial => '/layouts/newtask'
      end
    else
      error = error_messages(@task)
      render :update do |page|
        page.call 'growl', error
      end
    end
  end
  
  def edit
      @task = Task.find(params[:id])
  end
  
  def update
    @task = Task.find(params[:id])
    if @task.update_attributes(params[:task])
      flash[:notice] = "Successfully updated tasks."
      redirect_to edit_task_url(:id=>@task.id)
    else
      flash[:error] = error_messages(@task)
      render :action => 'edit'
    end
  end
  
  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    flash[:notice] = "Successfully destroyed task."
    redirect_to tasks_url
  end
  
  def reload_gcal
    
    init_google_cal
    
    render :update do |page|
      page.replace_html 'gcal', :partial => '/layouts/googlecal'
    end
  end
  
  private
  
  def task
    @current = "Tasks"
  end
  
end
