When /^I create a task named "([^\"]*)"$/ do |name|
  fill_in :name, :with => name
  click_button 'Create'
end

