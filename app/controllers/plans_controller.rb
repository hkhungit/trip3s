class PlansController < ApplicationController

  before_action :set_plan, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token, :only => :createPlan

  layout :resolve_layout
  def resolve_layout
    case action_name
    when "new", "create"
      "trip3s_plan_new"
    else
      "trip3s"
    end
  end
  # GET /plans
  # GET /plans.json
  def index
 
    
    @plan_cate    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_plan'}) 
    @plans        = Post.joins(:plans).all.limit(10)
    @planLastest  = Post.joins(:plans).order("id desc").limit(10)
    @planRandom   = Post.joins(:plans).offset(rand()).first
    @planViewest  = Post.joins(:plans).order("post_view desc").limit(5)
    @planBest     = Plan.best 
    @places_city      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_city'}) 
  end

  # GET /plans/1
  # GET /plans/1.json
  def show
    @post = Post.where(:id=>@plan.post_id).first
    @comments     = Comment.where(:post_id => @post.id).order("id desc").limit(5);
    @new_comment = @post.comments.new
    
    #viewCount = @post.post_view + 1
    #@post.update({:post_view => (@post.post_view + 1)})
  end

  def search

    @places_city      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_city'}) 
    @plan_cate    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_plan'}) 

    #All place none filter
    @results    = Post.select("posts.id,
                  posts.post_title,
                  posts.post_content,
                  posts.post_thumbnail,
                  posts.post_url,
                  posts.post_point,
                  posts.post_review,
                  posts.post_view")
            .distinct
            .where(:posts => {:post_type=> 'type_plan' }) 
            .order('post_view desc')

    if params[:k].present?
      _like  = params[:k]
      _like  = _like.gsub(/[ \'']/, '%') 
      _temp  =  @results 
            .where(" posts.post_title LIKE '%#{_like}%' ").pluck(:id)
      @results = @results.where("posts.id IN (?)",_temp )
    end

    #Check city in filter
    if params[:city].present? and @results.present?
      _temp   = @results
            .joins(:plans,:post_category =>{:type=>:category})
            .where(:types => {:category_id=> params[:city]}).pluck(:id)
      @results = @results.where("posts.id in (?)",_temp )
    end 
    #Check city in filter
    if params[:l].present? and @results.present?
      _temp   = @results 
            .joins(:plans,:post_category =>{:type=>:category})
            .where(:types => {:category_id=> params[:l]}).pluck(:id)
      @results = @results.where("posts.id in (?)",_temp )
    end 

    #Check money in filter
    if params[:m].present? and @results.present?
      
      _temp   = @results 
            .joins(:plans)
            .where(" plans.plan_money <= #{params[:m].to_i} ").pluck(:id)
      @results = @results.where("posts.id in (?)",_temp )
    end 

    #Check money in filter
    if params[:u].present? and @results.present?
      _temp   = @results 
            .joins(:plans)
            .where(" plans.plan_spend <= #{params[:u].to_i} ").pluck(:id)
      @results = @results.where("posts.id in (?)",_temp )
    end 

    #Check money in filter
    if params[:n].present? and @results.present?
      _temp   = @results 
            .joins(:plans)
            .where(" plans.plan_day <= #{params[:n].to_i} ").pluck(:id)
      @results = @results.where("posts.id in (?)",_temp )
    end 


    @results = @results.limit(12)

  end
  def k_mean
    
  end
  # GET /plans/new
  def new
    
    @plan = Plan.new
    @plan_cate    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_plan'}) 
    @places_city      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_city'}) 
    @places_purpose   = Category.select("*").joins(:type).where(:types => {:type_name => 'type_purpose_place'}) 
    @places_cuisine   = Category.select("*").joins(:type).where(:types => {:type_name => 'type_cuisine_place'}) 
    @places_property  = Category.select("*").joins(:type).where(:types => {:type_name => 'type_property_place'}) 
    @places_diding    = Category.select("*").joins(:type).where(:types => {:type_name => 'type_diding_place'}) 
    @places_area      = Category.select("*").joins(:type).where(:types => {:type_name => 'type_area'}) 
    @places_category  = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'}) 
    @district_category= Category.select("*").joins(:type).where(:types => {:type_name => 'type_district',:type_parent => '123'}) 
    @places  = Post.select("*").joins(:place).order('post_view desc')
    @uploader = ImageUploader.new

  end

  # GET /plans/1/edit
  def edit
  end


  # POST /plans
  # POST /plans.json
  def create
    if current_user.nil?
      redirect_to login_path
      return
    end

    status = true
    post_id = ''
    if session[:plan].present? 
      _post = {
        :post_title     => params[:plan][:plan_title],
        :post_content   => params[:plan][:plan_content], 
        :post_type =>  'type_plan',
      }
      post_id = savePostInPlan(_post)
      if post_id !=false
        if params[:plan][:plan_thumbnail].present? 
          _thumbnail = PostExpand.new({:post_id=> post_id, :expand_name =>'post_thumbnail2', :expand_value => params[:plan][:plan_thumbnail]})
          _thumbnail.save
        else
          _thumbnail = PostExpand.new({:post_id=> post_id, :expand_name =>'post_thumbnail2', :expand_value => 'default.png'})
          _thumbnail.save 
        end
        _plan = {
          :post_id    => post_id,
          :plan_day   => session[:plan]["dayNumber"].to_i,
          :plan_start => session[:plan]["planStart"],
          :plan_end   => session[:plan]["planEnd"],
          :plan_money => session[:plan]["money"].to_i,
          :plan_spend => session[:plan]["userNumber"].to_i
        }


        @plan = Plan.new(_plan)
        
        if @plan.save
          plan_id = @plan.id

          if session[:plan]["dayNumber"].to_i < 2
            day_of_schedule = 1
            _schedule = {
              :plan_id          => plan_id,
              :schedule_day     => day_of_schedule,
              :schedule_action  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["userNumber"],
              :schedule_spend   => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["money"],
              :schedule_distance  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["distance"],
              :schedule_duration  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["duration"],
              :schedule_end     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeEnd"],
              :schedule_start   => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeStart"]
            }
            schedule_id = saveScheduleInPlan(_schedule)
            if schedule_id !=false
                 #Save place begin of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeBegin"]
                place_come  = crrPlace['place_out']

                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_ticket"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 1,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)

                places  = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeLists"]
                places.each do |crrPlace|
                  place_come  = crrPlace['place_come']
                  place_come  = "#{place_come}:00"
                  place_out   = crrPlace['place_out']
                  place_out   = "#{place_out}:00"

                  _detail = {
                      :place_id     => crrPlace["place_id"],
                      :schedule_id  => schedule_id,
                      :place_name   => crrPlace["post_title"],
                      :place_spend  => crrPlace["place_money"],
                      :place_lat    => crrPlace["place_lat"],
                      :place_lng    => crrPlace["place_lng"],
                      :place_note   => crrPlace["place_note"],
                      :place_img    => crrPlace["post_thumbnail"],
                      :place_type   => 2,
                      :place_in     => place_come,
                      :place_out    => place_out,
                      :next_time    => crrPlace["next_time"],
                      :next_distance => crrPlace["next_distance"]
                    }
                  saveDetailInSchedule(_detail)
                end

                #Save place end of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeEnd"]
                place_come  = crrPlace['place_come']
                place_come  = "#{place_come}:00"
                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 3,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                saveDetailInSchedule(_detail)
            else
              status =false
              Schedule.delete(schedule_id)
              Plan.delete(plan_id)
              Post.delete(post_id)
            end
          else
            (1..session[:plan]["dayNumber"].to_i).each do |day_of_schedule|
              _schedule = {
                :plan_id            => plan_id,
                :schedule_day       => day_of_schedule,
                :schedule_action    => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["userNumber"],
                :schedule_spend     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["moneySpend"],
                :schedule_distance  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["distance"],
                :schedule_duration  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["duration"],
                :schedule_end       => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeEnd"],
                :schedule_start     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeStart"]
              }
              schedule_id = saveScheduleInPlan(_schedule)
              if schedule_id !=false
                 #Save place begin of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeBegin"]
                place_come  = crrPlace['place_out']
                place_come  = "#{place_come}:00"

                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 1,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)

                places  = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeLists"]
                places.each do |crrPlace|
                  place_come  = crrPlace['place_come']
                  place_come  = "#{place_come}:00"
                  place_out   = crrPlace['place_out']
                  place_out   = "#{place_out}:00"

                  _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 2,
                    :place_in     => place_come,
                    :place_out    => place_out,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)
                end

                #Save place end of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeEnd"]
                place_come  = crrPlace['place_come']
                place_come  = "#{place_come}:00"
                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 3,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)
              else
                status =false
                Schedule.delete(schedule_id)
                Plan.delete(plan_id)
                Post.delete(post_id)
              end
            end
          end
        else
          status =false
          Plan.delete(plan_id)
        end
      end
    end

    if status
      user_post = UserPost.new
      user_post.post_id = post_id
      user_post.user_id = session[:user_id]
      user_post.permission = 1
      user_post.save

      userList =  session[:plan]["userList"]
      userList.each do |userId|
        user_postLi = UserPost.new
        user_postLi.post_id = post_id
        if userId != session[:user_id]
           user_postLi.user_id = userId
          user_postLi.permission = 2
          user_postLi.save
        end
      end

      plan_cates = params[:plan][:plan_cate]
      if plan_cates.present?
        plan_cates.each do |cate|
          type = Type.where(:category_id => cate).last
          if type.id.present?
             planCate = PostCategory.new
            planCate.post_id = post_id
            planCate.type_id = type.id
            planCate.save
          end
        end
      end

      plan_cities = params[:plan][:plan_city]
      if plan_cities.present?
        plan_cities.each do |cate|
          type = Type.where(:category_id => cate).last
          if type.id.present?
            planCate = PostCategory.new
            planCate.post_id = post_id
            planCate.type_id = type.id
            planCate.save
          end
        end
      end 
    session[:plan] = nil
    end
    redirect_to @plan
    #redirect_to new_plan_path
  end
  def createPlan
    if current_user.nil?
      redirect_to login_path
      return
    end

    status = true
    post_id = ''
    if session[:plan].present?
      _post = {
        :post_title   => params[:plan][:plan_title],
        :post_content => params[:plan][:plan_content],
      }
      post_id = savePostInPlan(_post)
      if post_id !=false
        _plan = {
          :post_id    => post_id,
          :plan_day   => session[:plan]["dayNumber"].to_i,
          :plan_start => session[:plan]["planStart"],
          :plan_end   => session[:plan]["planEnd"],
          :plan_money => session[:plan]["money"].to_i,
          :plan_spend => 0
        }


        @plan = Plan.new(_plan)
        
        if @plan.save
          plan_id = @plan.id

          if session[:plan]["dayNumber"].to_i < 2
            day_of_schedule = 1
            _schedule = {
              :plan_id          => plan_id,
              :schedule_day     => day_of_schedule,
              :schedule_action  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["userNumber"],
              :schedule_spend   => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["money"],
              :schedule_distance  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["distance"],
              :schedule_duration  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["duration"],
              :schedule_end     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeEnd"],
              :schedule_start   => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeStart"]
            }
            schedule_id = saveScheduleInPlan(_schedule)
            if schedule_id !=false
                 #Save place begin of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeBegin"]
                place_come  = crrPlace['place_out']
                place_come  = "#{place_come}:00"

                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 1,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)

                places  = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeLists"]
                places.each do |crrPlace|
                  place_come  = crrPlace['place_come']
                  place_come  = "#{place_come}:00"
                  place_out   = crrPlace['place_out']
                  place_out   = "#{place_out}:00"

                  _detail = {
                      :place_id     => crrPlace["place_id"],
                      :schedule_id  => schedule_id,
                      :place_name   => crrPlace["post_title"],
                      :place_spend  => crrPlace["place_money"],
                      :place_lat    => crrPlace["place_lat"],
                      :place_lng    => crrPlace["place_lng"],
                      :place_note   => crrPlace["place_note"],
                      :place_img    => crrPlace["post_thumbnail"],
                      :place_type   => 2,
                      :place_in     => place_come,
                      :place_out    => place_out,
                      :next_time    => crrPlace["next_time"],
                      :next_distance => crrPlace["next_distance"]
                    }
                  saveDetailInSchedule(_detail)
                end

                #Save place end of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeEnd"]
                place_come  = crrPlace['place_come']
                place_come  = "#{place_come}:00"
                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 3,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                saveDetailInSchedule(_detail)
            else
              status =false
              Schedule.delete(schedule_id)
              Plan.delete(plan_id)
              Post.delete(post_id)
            end
          else
            (1..session[:plan]["dayNumber"].to_i).each do |day_of_schedule|
              _schedule = {
                :plan_id            => plan_id,
                :schedule_day       => day_of_schedule,
                :schedule_action    => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["userNumber"],
                :schedule_spend     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["moneySpend"],
                :schedule_distance  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["distance"],
                :schedule_duration  => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["duration"],
                :schedule_end       => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeEnd"],
                :schedule_start     => session[:plan]["schedules"]["Day_#{day_of_schedule}"]["timeStart"]
              }
              schedule_id = saveScheduleInPlan(_schedule)
              if schedule_id !=false
                 #Save place begin of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeBegin"]
                place_come  = crrPlace['place_out']
                place_come  = "#{place_come}:00"

                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 1,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)

                places  = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeLists"]
                places.each do |crrPlace|
                  place_come  = crrPlace['place_come']
                  place_come  = "#{place_come}:00"
                  place_out   = crrPlace['place_out']
                  place_out   = "#{place_out}:00"

                  _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 2,
                    :place_in     => place_come,
                    :place_out    => place_out,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)
                end

                #Save place end of schedule
                crrPlace = session[:plan]["schedules"]["Day_#{day_of_schedule}"]["placeEnd"]
                place_come  = crrPlace['place_come']
                place_come  = "#{place_come}:00"
                _detail = {
                    :place_id     => crrPlace["place_id"],
                    :schedule_id  => schedule_id,
                    :place_name   => crrPlace["post_title"],
                    :place_spend  => crrPlace["place_money"],
                    :place_lat    => crrPlace["place_lat"],
                    :place_lng    => crrPlace["place_lng"],
                    :place_note   => crrPlace["place_note"],
                    :place_img    => crrPlace["post_thumbnail"],
                    :place_type   => 3,
                    :place_in     => place_come,
                    :place_out    => place_come,
                    :next_time    => crrPlace["next_time"],
                    :next_distance => crrPlace["next_distance"]
                  }
                  saveDetailInSchedule(_detail)
              else
                status =false
                Schedule.delete(schedule_id)
                Plan.delete(plan_id)
                Post.delete(post_id)
              end
            end
          end
        else
          status =false
          Plan.delete(plan_id)
        end
      end
    end
    if status
      post_expand = PostExpand.new
      post_expand.post_id   = post_id
      post_expand.expand_name   = 'vectorDistances'
      post_expand.expand_value  =  JSON.generate(session[:plan]["vectorDistances"])
      post_expand.save
    end


    if status
      user_post = UserPost.new
      user_post.post_id = post_id
      user_post.user_id = session[:user_id]
      user_post.permission = 1
      user_post.save

      userList =  session[:plan]["userList"]
      userList.each do |userId|
        user_postLi = UserPost.new
        user_postLi.post_id = post_id
        if userId != session[:user_id]
           user_postLi.user_id = userId
          user_postLi.permission = 2
          user_postLi.save
        end
      end
      session[:plan] = nil
    end

    render json: {
      :status => status,
      :post_id =>post_id
    }
  end
  #Save Plan in posts table
  def savePostInPlan post 
    if post.nil?
      return false;
    end
    tmpPost = Post.new
    tmpPost.post_title    =   post[:post_title]
    tmpPost.post_content  =   post[:post_content]
    tmpPost.post_type     =   'type_plan'
    tmpPost.post_view     =   0
    tmpPost.post_review   =   0
    tmpPost.post_point    =   0
    if tmpPost.save
      return tmpPost.id      
    end
    return false
  end 

  #Save Plan in plans table
  def savePlanInPlan plan
    if plan.nil?
      return false
    end
    
    tmpPlan = Plan.new
    tmpPlan.post_id     = plan[:post_id]
    tmpPlan.plan_day    = plan[:plan_day]
    tmpPlan.plan_start  = plan[:plan_start]
    tmpPlan.plan_end    = plan[:plan_end]
    tmpPlan.plan_money  = plan[:plan_money]
    tmpPlan.plan_spend  = plan[:plan_spend]
    if tmpPlan.save
      puts "save plan #{tmpPlan.id}"
      return tmpPlan    
    end
    return false
  end 
  #Save schedule of plan in schedules table
  def saveScheduleInPlan schedule
    if schedule.nil?
      return false
    end
    tmpSchedule = Schedule.new

    tmpSchedule.plan_id           = schedule[:plan_id]
    tmpSchedule.schedule_day      = schedule[:schedule_day]
    tmpSchedule.schedule_action   = schedule[:schedule_action]
    tmpSchedule.schedule_spend    = schedule[:schedule_spend]
    tmpSchedule.schedule_distance = schedule[:schedule_distance]
    tmpSchedule.schedule_start    = schedule[:schedule_start]
    tmpSchedule.schedule_end      = schedule[:schedule_end]
    if tmpSchedule.save
      puts "save schedule #{tmpSchedule.id  }"
      return tmpSchedule.id      
    end

      puts "error save schedule }"
    return false
  end
  #Save detail schedile of schedule in schedule_details table
  def saveDetailInSchedule detail
    if detail.nil?
      return false
    end

    tmpDetail = ScheduleDetail.new

    tmpDetail.place_id      = detail[:place_id]
    tmpDetail.schedule_id   = detail[:schedule_id]
    tmpDetail.place_name    = detail[:place_name]
    tmpDetail.place_spend   = detail[:place_spend]
    tmpDetail.place_lat     = detail[:place_lat]
    tmpDetail.place_lng     = detail[:place_lng]
    tmpDetail.place_type    = detail[:place_type]
    tmpDetail.place_in      = detail[:place_in]
    tmpDetail.place_out     = detail[:place_out]
    tmpDetail.place_img     = detail[:place_img]
    tmpDetail.place_note    = detail[:place_note]
    tmpDetail.next_time     = detail[:next_time]
    tmpDetail.next_distance = detail[:next_distance]

    if tmpDetail.save
      puts "save detail come: #{tmpDetail.place_in} and out: #{tmpDetail.place_out}"
      return tmpDetail.id
    end
      puts "error save detail"
    return false
  end




  # PATCH/PUT /plans/1
  # PATCH/PUT /plans/1.json
  def update
    respond_to do |format|
      if @plan.update(plan_params)
        format.html { redirect_to @plan, notice: 'Plan was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plans/1
  # DELETE /plans/1.json
  def destroy
    @plan.destroy
    respond_to do |format|
      format.html { redirect_to plans_url }
      format.json { head :no_content }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plan

      begin
        @plan         = Plan.find(params[:id])

        @categories   = filter_category  @plan.post_id, 'type_category_plan'
        @comments     = Comment.where(:post_id => @plan.post_id).order("id desc").limit(5);
        #@user = @plan.post.user_post.where(permission: 1).last.user
        @user       = User.joins(:user_post).where({:user_posts => {post_id: @plan.post.id, permission: 1 }}).first
        if @user.nil?
          raise
        end

        @schedules  = Schedule.where({:plan_id => @plan.id})
        @details    = ScheduleDetail.joins(:schedule).where({:schedules =>{:plan_id => @plan.id}})
        @images     = Image.joins(:post_image).all
      rescue
        redirect_to error_path
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def plan_params
      params.require(:plan).permit(:post_id, :plan_day, :plan_start, :plan_end, :plan_money, :plan_spend)
    end
    def filter_category (post_id ,type_name)
    postCategories  = PostCategory.select("*")
                     .joins(:type=>:category)
                     .where(:types => {:type_name => "#{type_name}"}, 'post_id' => "#{post_id}")
    return postCategories
  end
  def trip3sReset
    date = 7.days.from_now
    session[:plan] = {
        :tripName       => 'Du lịch trip3s',
        :dayNumber      => 1,
            :userNumber     => 1,
            :timeStart      => 7.5,
            :planStart      => 2,
            :timeEnd      => 24,
            :moneyNumber    => 0,
            :planEnd      => "",
            :placeBegin     => "",
            :placeEnd       => "",
            :planStart      => "",
            :placeIds       => Array.new,
            :placeLists     => Array.new,
            :vectorDistances  => {},
            :schedules      => Array.new
      }
    session[:plan]["planStart"] = date.strftime("%d/%m/%G")
    render json: {
      'status' =>status,
      'plan'   =>session[:plan]
    }
  end
end
