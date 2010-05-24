# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
require 'yaml'
class ApplicationController < ActionController::Base
  include Authentication
  include GCal4Ruby
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
  def init_google_cal
    @service = Service.new()
    config = YAML.load_file("config/googlecal.yml")
    @service.authenticate(config["credential"]["calendar_name"], config["credential"]["password"])
    @cal = @service.calendars[0]
  end
  
  def shorten (string, count = 30)
  	if string.length >= count 
  		shortened = string[0, count]
  		splitted = shortened.split(/\s/)
  		words = splitted.length
  		splitted[0, words-1].join(" ") + ' ...'
  	else 
  		string
  	end
  end
  
  def error_messages(obj)
    error_message = ''
    for message in obj.errors.full_messages
        error_message = error_message + "#{message}<br>"
    end 
    return error_message
  end
  
end
