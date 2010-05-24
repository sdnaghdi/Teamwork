require 'test_helper'

class TasksControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end
  
  def test_show
    get :show, :id => Tasks.first
    assert_template 'show'
  end
  
  def test_new
    get :new
    assert_template 'new'
  end
  
  def test_create_invalid
    Tasks.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end
  
  def test_create_valid
    Tasks.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to tasks_url(assigns(:tasks))
  end
  
  def test_edit
    get :edit, :id => Tasks.first
    assert_template 'edit'
  end
  
  def test_update_invalid
    Tasks.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Tasks.first
    assert_template 'edit'
  end
  
  def test_update_valid
    Tasks.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Tasks.first
    assert_redirected_to tasks_url(assigns(:tasks))
  end
  
  def test_destroy
    tasks = Tasks.first
    delete :destroy, :id => tasks
    assert_redirected_to tasks_url
    assert !Tasks.exists?(tasks.id)
  end
end
