class ApiController < ApplicationController
	skip_before_action :verify_authenticity_token

	def index
	end
	def record
		posts 	= Post.all
		places 	= Place.all

		render json:{
			'Posts: ' => posts.count,
			'Places: ' => places.count
		}
	end
	def createTrip3sPlan
		session[:plan] = {
				:dayNumber 			=> "1",
		        :userNumber			=> "1",
		        :planStart			=> "",
		        :moneyNumber		=> "1",
		        :planEnd 			=> "",
		        :placeBegin 		=> "",
		        :placeEnd 			=> "",
		        :planStart 			=> "",
		        :placeIds 			=> Array.new,
		        :placeLists			=> Array.new,
		        :vectorDistances	=> {},
		        :placeNotSchedule	=> Array.new,
		        :schedules 			=> Array.new
			}
	end
	def trip3sReset
		createTrip3sPlan
		render json: {
			'status' =>status,
			'plan'   =>session[:plan]
		}
	end
	def  trip3sPlan
		status =true
		if session[:plan].blank?
			createTrip3sPlan
		end
		
		if params[:plan].present?
			session[:plan] = JSON.parse(params[:plan])
		end

		render json: {
			'status' =>status,
			'plan'   =>session[:plan]
		}
	end

	#action load places filter by city, district,area, cate,cuisine, property,dide, purpose
	def load_place_filter
		#All place none filter
		places 		=	Post.select("posts.id,
									posts.post_title,
									posts.post_content,
									posts.post_thumbnail,
									posts.post_url,
									posts.post_point,
									posts.post_review,
									posts.post_view")
						.distinct
						.joins(:place,:post_category =>{:type=>:category})
						.order('post_view desc')
		#Check condition filter
		check_filter 	= false
		location_arr 	= Array.new
		#Check city in filter
		if params[:cityIds].present? && params[:cityIds] !=''
			#places = places.where(:types => {:category_id=> params[:cityIds]})
			location_arr = {
				:ids 	=> params[:cityIds],
				:name 	=> 'type_city'}
			check_filter =true
		end

		#Check district
		if params[:districtIds].present?
			#places = places.where(:types => {:category_id=> params[:districtIds]})
			check_filter =true
			location_arr = {
				:ids 	=> params[:districtIds],
				:name 	=> 'type_district'}
		end

		#Check area
		if params[:areaIds].present? && params[:areaIds] !=''
			#places = places.where(:types => {:category_id=> params[:areaIds]})
			check_filter =true
			location_arr = {
				:ids 	=> params[:areaIds],
				:name 	=> 'type_area'}
		end


		#Get all place of location
		if location_arr.present?
			check_filter =true
			places = places.where("posts.id in (?)",places.select("posts.id").where(:types => {:category_id=> location_arr[:ids],:type_name=> location_arr[:name]})	)
		end


		#Check city
		if params[:cateIds].present?
			check_filter =true
			places = places.where("posts.id in (?)",places.select("posts.id").where(:types => {:category_id=> params[:cateIds],:type_name=> 'type_category_place'})	)
		end

		#Check city
		if params[:proIds].present?
			places = places.where("posts.id in (?)",
							places.select("posts.id")
							.where(:types => {:category_id=> params[:proIds],:type_name=> 'type_property_place'})		)
			check_filter =true
		end

		#Check city
		if params[:cuiIds].present?
			places = places.where("posts.id in (?)",
							places.select("posts.id")
							 .where(:types => {:category_id=> params[:cuiIds],:type_name=> 'type_cuisine_place'})	)
			
			check_filter =true
		end

		#Check city
		if params[:didIds].present?
			places = places.where("posts.id in (?)",
							places.select("posts.id")
							.where(:types => {:category_id=> params[:didIds],:type_name=> 'type_diding_place'})	)
			
			check_filter =true
		end

		#Check city
		if params[:purIds].present?
			places = places.where("posts.id in (?)",
							places.select("posts.id")
							.where(:types => {:category_id=> params[:purIds],:type_name=> 'type_purpose_place'}))
			
			check_filter =true
		end

		if check_filter ==false
			places = places.where(:types => {:type_name=> 'type_category_place'})
		end

		_count = places.count('posts.id')

		offset = 0;
		limit = 12;
		if params[:offset].present?
			offset = params[:offset]
		end
		if params[:limit].present?
			limit = params[:limit]
		end

		render json: {
				:count 	=> _count,
				:places => return_place_ids(places,offset,limit)
				}
	end

	def return_place_ids(places, offset=0,limit=12)
		places_temp 	= 	places.offset(offset).limit(limit)

		arr 		=	Array.new 
		
		places_temp.each do |place|
			#filter category of place
			categories 	 = 	filter_category place.id, 'type_category_place'
			arrCate 	 =  Array.new
			categories.each do |cate|
				arrCate << cate.type.category.cate_name
			end

			temp_place 	 =	{
				'post_id' 		=>	place.id	,
				'post_title' 	=> 	place.post_title	,
				'post_content' 	=> 	place.post_content	,
				'post_thumbnail'=> 	place.post_thumbnail	,
				'permalink' 	=> 	place.post_url,
				'avatar' 		=> 	place.post_thumbnail	,
				'rating' 		=> 	place.post_view	,
				'post_view' 	=> 	place.post_view	,
				'post_review' 	=> 	place.post_review	,
				'post_point' 	=> 	place.post_point	,
				'favorite' 		=> 	''	,
				'category' 		=> 	arrCate.to_sentence 	,
				'place_lat' 	=> 	place.place[0].place_lat,
				'place_lng' 	=> 	place.place[0].place_lng,
				'place_id' 		=> 	place.place[0].id,
				'location' 		=> 	place.place[0].place_address	,
				'place_time'	=>  place.place[0].place_time,
				'place_open'	=>  place.place[0].place_open,
				'place_close'	=>  place.place[0].place_close,
				'place_late'	=>  place.place[0].place_late,
				'place_choise'	=>  place.place[0].place_choice,
				'place_ticket'	=>  place.place[0].place_ticket,
				'place_min'		=>  place.place[0].place_min,
				'place_max'		=>  place.place[0].place_max
			}
			arr << temp_place
		end
		
		return arr
	end

	#add place to plan
	def add_to_plan
		create_plan
		if params[:act] == 'add_place'
			if !(session[:plan][:place_ids]||=[]).include?(params[:place_id].to_i)
				(session[:plan][:place_ids]||=[]) << params[:place_id].to_i
			end
		elsif params[:act] == 'remove_place'
			if session[:plan][:place_ids].present?
				session[:plan][:place_ids].delete(params[:place_id].to_i)
			end
		end

		render json: {
			'placeIds' 		=> session[:plan][:place_ids],
			'placeLists'	=> trip3s_places(session[:plan][:place_ids])
		}
	end

	# Action relation in creating plan

	# Create a plan
	def create_plan
		if session[:plan].nil?
			puts "start session plan"
			session[:plan] = {
				:day_number => 1,
				:user_number => 1,
				:plan_start => '',
				:plan_end =>'',
				:place_ids =>Array.new,
				:schedule => Array.new
			}
		end
		if !params[:day_number].nil?
			session[:plan][:day_number] = params[:day_number].to_i
		end
		if !params[:user_number].nil?
			session[:plan][:user_number] = params[:user_number].to_i
		end
		if !params[:plan_start].nil?
			session[:plan][:plan_start] = params[:plan_start]
		end
		if !params[:plan_end].nil?
			session[:plan][:plan_end] = params[:plan_end]
		end

	end

	# create a schedule
	def create_schedule
		create_plan
		day_of_schedule	=	params[:schedule_day].nil? ? 1 : params[:schedule_day].to_i
		day_number 		= 	session[:plan][:day_number]
		if params[:clusters].present?
			params[:clusters].each do |i, _clusters|
				schedule 		= { :place_ids => Array.new, :day	=> i}
				puts "_clusters"
				session[:plan][:schedule][i.to_i] =  schedule
				if _clusters.present?
					_clusters.each do |p, place|
						(session[:plan][:schedule][i.to_i][:place_ids] ||=[]) << place[:post_id]
					end
					session[:plan][:schedule][i.to_i][:placeLists] = trip3s_places(session[:plan][:schedule][i.to_i][:place_ids])
					session[:plan][:schedule][i.to_i][:distance] = 0
				end

			end		
		elsif session[:plan][:schedule].blank?
			schedule 		= { :place_ids => Array.new, :day	=> day_of_schedule}
			session[:plan][:schedule][day_of_schedule] =  schedule
		else
			session[:plan][:day_number] = day_of_schedule if day_of_schedule.to_i >session[:plan][:day_number].to_i
		end

		
	end

	# add extra day to schedule
	def add_day
		if params[:add_day].present?

			session[:plan][:dayNumber] = session[:plan][:dayNumber].to_i +  1
			
		puts "dayNumber"
		puts session[:plan][:dayNumber]
		end

		render json: {
			'dayNumber' => session[:plan][:dayNumber]
		}
	end
	
	#add extra plan to day in schedule
	def add_place_to_plan
		#session.delete(:plan)
		create_schedule
		day_of_schedule	=	params[:schedule_day].nil? ? '1' : params[:schedule_day].to_i

		action2 			=   'add_place'
		action2 			=	'remove_place' if params[:action2].present? && params[:action2] != 'add_place' 
		puts action2
		if action2 == 'add_place'
			if session[:plan][:schedule][day_of_schedule].blank?
				schedule 		= { :place_ids => Array.new, :day	=> day_of_schedule}
				session[:plan][:schedule][day_of_schedule] =  schedule
				(session[:plan][:schedule][day_of_schedule][:place_ids] ||=[]) << params[:place_id].to_i
				puts ="add first"
			elsif !session[:plan][:schedule][day_of_schedule][:place_ids].include?params[:place_id].to_i
				(session[:plan][:schedule][day_of_schedule][:place_ids] ||=[]) << params[:place_id].to_i
				puts ="add first 2"
			end
		else
			puts "remove";
			session[:plan][:schedule][day_of_schedule][:place_ids].delete(params[:place_id].to_i);
		end
		puts session[:plan][:schedule][day_of_schedule][:place_ids]
		render json: {
				'day'		=>	params[:schedule_day].to_i,
				'places' 	=>	trip3s_places(session[:plan][:schedule][day_of_schedule][:place_ids])
				}
	end



	def k_mean
		places = Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
								.distinct.joins(:place,:post_category =>{:type=>:category})
								.order('post_view desc')
								.where(:types => {:type_name => 'type_category_place'}, :id =>session[:plan][:place_ids])
		arr 		=	Array.new 
		places.each do |place|
			temp_place 	 =	{
				'post_id' 		=>	place.id	,
				'post_title' 	=> 	place.post_title	,
				'place_lat' 	=> 	place.place[0].place_lat.to_f,
				'place_lng' 	=> 	place.place[0].place_lng.to_f,
				'place_id' 		=> 	place.place[0].id,
				'place_time'	=>  place.place[0].place_time,
				'place_open'	=>  place.place[0].place_open,
				'place_close'	=>  place.place[0].place_close,
				'place_late'	=>  place.place[0].place_late
			}
			arr << temp_place
		end		
		render json: {
				'places' 	=>	arr
				}
	end
	def get_placeIds
		places = Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
								.distinct.joins(:place,:post_category =>{:type=>:category})
								.order('post_view desc')
								.where(:types => {:type_name => 'type_category_place'}, :id => params[:placeIds])
		arr 		=	Array.new 
		places.each do |place|
			temp_place 	 =	{
				'post_id' 		=>	place.id	,
				'post_title' 	=> 	place.post_title	,
				'post_thumbnail'=> 	place.post_thumbnail	,
				'post_title' 	=> 	place.post_title	,
				'place_lat' 	=> 	place.place[0].place_lat.to_f,
				'place_lng' 	=> 	place.place[0].place_lng.to_f,
				'place_id' 		=> 	place.place[0].id,
				'place_time'	=>  place.place[0].place_time,
				'place_open'	=>  place.place[0].place_open,
				'place_close'	=>  place.place[0].place_close,
				'place_late'	=>  place.place[0].place_late
			}
			arr << temp_place
		end		
		render json: {
				'places' 	=>	arr,
				'status' 	=>	'OK'
				}
	end



	# Action have relation with loading
	# Loading plan via day of schedule
	def load_plan
		create_schedule
		day_of_schedule	=	params[:schedule_day].nil? ? 1 : params[:schedule_day].to_i
		
		if session[:plan][:place_ids].blank?
			return render json: {
				'day'		=>	day_of_schedule,
				'places' 	=>	[]
				}
		end
		

		render json: {
				'day'		=>	day_of_schedule,
				'places' 	=>	trip3s_places(session[:plan][:place_ids])
				}
	end

	
	def return_day
		create_schedule
		render json: { :schedule	=>	session[:plan][:schedule], :day_number => session[:plan][:day_number]	}
	end

	def delete_place_to_plan

		if !session[:plan][:list_places].include?params[:place_id].to_i
			session[:plan][:list_places] << params[:place_id].to_i
		end

		#render json: session[:plan][:list_places]
		render json: trip3s_places(session[:plan][:list_places])
	end

	def javo_map_all

		places 		=	Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
						.joins(:place,:post_category =>{:type=>:category})
						.order('post_view desc')
						.where(:types => {:type_name => 'type_category_place'})

		if params[:cateIds].present?
			places = places.where(:types => {:category_id=> params[:cateIds]})
		end

		if params[:page].present?
			places = places.offset(params[:page] * 12);
		end
		places = places.limit(12)

		arr 		=	Array.new 
		
		places.each do |place|
			#filter category of place
			categories 	 = 	filter_category place.id, 'type_category_place'
			arrCate 	 =  Array.new
			categories.each do |cate|
				arrCate << cate.type.category.id
			end
			temp_place 	 =	{
				'post_id' 		=>	place.id	,
				'post_thumbnail'=>  place.post_thumbnail,
				'post_title' 	=> 	place.post_title	,
				'cat_term' 		=> 	arrCate	,
				'loc_term' 		=> 	place.post_title	,
				'lat' 			=> 	place.place[0].place_lat	,
				'lng'			=> 	place.place[0].place_lng,
				'place_time'	=>  place.place[0].place_time,
				'place_open'	=>  place.place[0].place_open,
				'place_close'	=>  place.place[0].place_close,
				'place_late'	=>  place.place[0].place_late	
			}
			arr << temp_place
		end
		
		render json: arr
	end
	def javo_map_list
		render json: trip3s_places
	end
	def trip3s_placeIds ids = nil
		
	end

	def trip3s_places ids = nil
		
		if ids.present?
			places 		=	Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
								.distinct.joins(:place,:post_category =>{:type=>:category})
								.order('post_view desc')
								.where(:types => {:type_name => 'type_category_place'}, :id =>ids)
		else
			places 		=	Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
								.distinct.joins(:place,:post_category =>{:type=>:category})
								.order('post_view desc')
								.where(:types => {:type_name => 'type_category_place'}).limit(50)							

		end
	
		arr 		=	Array.new 
		places.each do |place|
			#filter category of place
			categories 	 = 	filter_category place.id, 'type_category_place'
			arrCate 	 =  Array.new
			categories.each do |cate|
				arrCate << cate.type.category.cate_name
			end

			temp_place 	 =	{
				'post_id' 		=>	place.id	,
				'post_title' 	=> 	place.post_title	,
				'post_content' 	=> 	place.post_content	,
				'post_thumbnail'=> 	place.post_thumbnail	,
				'permalink' 	=> 	'#'	,
				'avatar' 		=> 	''	,
				'rating' 		=> 	place.post_view	,
				'favorite' 		=> 	''	,
				'category' 		=> 	arrCate.to_sentence 	,
				'place_lat' 	=> 	place.place[0].place_lat,
				'place_lng' 	=> 	place.place[0].place_lng,
				'place_id' 		=> 	place.place[0].id,
				'location' 		=> 	place.place[0].place_address	,
				'place_time'	=>  place.place[0].place_time,
				'place_open'	=>  place.place[0].place_open,
				'place_close'	=>  place.place[0].place_close,
				'place_late'	=>  place.place[0].place_late	
			}
			arr << temp_place
		end

		return arr
	end

	def trip3s_place_by_id

		if params[:post_id].blank?

		elsif params[:post_id] == 0

		else
			place 		=	Post.select("posts.id,posts.post_title,posts.post_content,posts.post_thumbnail,posts.post_view")
							.joins(:place,:post_category =>{:type=>:category})
							.order('post_view desc')
							.where(:types => {:type_name => 'type_category_place'},:id => params[:post_id]).first

			#filter category of place
			categories 	 = 	filter_category place.id, 'type_category_place'
			arrCate 	 =  Array.new
			categories.each do |cate|
				arrCate << cate.type.category.cate_name
			end

			render json: {
				'state'		 => 'success',
				'post_id' 	 => place.id,
				'post_title' => "#{place.post_title}",
				'permalink'  => "#",
				'thumbnail'  => "#{place.post_thumbnail}",
				'category'   => arrCate,
				'location'   => "#{place.place[0].place_address}",
				'phone' 	 => "#{place.place[0].place_phone}",
				'website' 	 => '',
				'email'		 => '',
				'address'	 => "#{place.place[0].place_address}",
				'author_name' => 'admin'
			}
			return ;
		end
				
		render json: {'s'=>'s'}
	end

	def filter_category (post_id ,type_name)
		postCategories 	=	PostCategory.select("*")
										 .joins(:type=>:category)
										 .where(:types => {:type_name => "#{type_name}"}, 'post_id' => "#{post_id}")
		return postCategories
	end

	def get_create_plan
		create_schedule
		render json: {:status =>'OK', :params => params[:clusters], :plan => session[:plan]}
	end
end