# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def current_selection(current)
    
    if @current == 'Overview'
      if current == 'Overview'
        return "class='selected'"
      end
    end
    
    if @current == 'Tasks'
      if current == 'Tasks'
        return "class='selected'"
      end
    end
    
    if @current == 'Users'
      if current == 'Users'
        return "class='selected'"
      end
    end
    
    if @current == 'Account'
      if current == 'Account'
        return "class='selected'"
      end
    end
    
    if @current == 'Projects'
      if current == 'Projects'
        return "class='selected'"
      end
    end
    
  end
  
  def formatted_date(the_date)
     the_date.strftime("%d, %B %Y") 
  end
  
  def formatted_date_with_time(the_date)
     the_date.strftime("%d, %B %Y - %I:%M %p") 
  end
  
  def simple_date(the_date)
      the_date.strftime("%d/%m/%y")
  end

  def simple_time(the_date)
      the_date.strftime("%H:%M")
  end  
  
  def select_date_reverse(the_date)
      the_date.strftime("%d.%m.%Y")
  end
  
  def clean_html(html)
    return Sanitize.clean(html, :elements => ['a','span','p','ol','ul','li','strong','u','i','br','img'],
    	                            :attributes => {'a' => ['href', 'title'],'span' => ['style','class'],
    	                                            'img' => ['width','height','alt','src']})
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
  
end
