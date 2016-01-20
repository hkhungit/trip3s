class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :edit, :update, :destroy]
  layout "trip3s"
  # GET /places
  # GET /places.json
  def index
    @places = Place.all
    @pl=Place.all.limit(8)
    @posts  = Post.select("*").joins(:place).order('post_view desc').limit(4)
    @places_cate = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'}).limit(6)
    @places_category = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'})
    @places_cate_all=Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place',:type_name => 'type_city',:type_name => 'type_district',:type_name => 'type_area',:type_name => 'type_diding_place',:type_name => 'type_property_place',:type_name => 'type_cuisine_place',:type_name => 'type_purpose_place'}).limit(10)
    @places_two_limit_one=Post.find_by_sql ["select A.post_title, A.post_review,B.place_choice,A.post_url,A.post_thumbnail from posts A,places B WHERE A.post_title like ? and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC limit 2", "%#{params[:search]}%"]
  end

  def search
     #select A.post_title, A.post_review,B.place_choice from posts A,places B WHERE A.post_title like '%caffe%Đồng%Khởi%' and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC
    @places_two_limit_one=Post.find_by_sql ["select A.post_title, A.post_review,B.place_choice,A.post_url,A.post_thumbnail from posts A,places B WHERE A.post_title like ? and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC limit 2", "%#{params[:search]}%"]
    
    render "place"
  end
  def search_all
     #select A.post_title, A.post_review,B.place_choice from posts A,places B WHERE A.post_title like '%caffe%Đồng%Khởi%' and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC
    @places_three=Post.find_by_sql ["select A.post_title, A.post_review,A.post_url,A.post_thumbnail from posts A WHERE A.post_title like ? ORDER by A.post_review DESC limit 3,3", "%#{params[:search]}%"]
    
    render "place_three"
  end
  def list
    @post_places=Post.all.paginate(page: params[:page], per_page: 5)
  end
  # GET /places/1
  # GET /places/1.json
  def show
  end
  #
  def resuft
     @places = Place.all
    @posts  = Post.select("*").joins(:place).order('post_view desc').limit(4)
    @places_category = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'})
    @places_cate_all=Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place',:type_name => 'type_city',:type_name => 'type_district',:type_name => 'type_area',:type_name => 'type_diding_place',:type_name => 'type_property_place',:type_name => 'type_cuisine_place',:type_name => 'type_purpose_place'}).limit(10)
 
  end
  # GET /places/new
  def new
    @place = Place.new
    @places_cate_all=Post.select("*").where(:post_title => {:type_name => 'type_category_place'})
    @places_three_limit=Post.select("*").order('post_review desc').limit(3,100)
    #'a d c'=>xyx='%a%b%c'


  end

  # GET /places/1/edit
  def edit
  end

  # POST /places
  # POST /places.json
  def create
     status = true
    post_id = ''
      _post = {
        :post_title     => params[:post][:plan_title],
        :post_content   => params[:post][:plan_content], 
        :post_type =>  'type_place'
      }
      post_id = savePost(_post)
      _place={
          :post_id    => post_id,
          :place_lat   => params[:place]["place_lat"],
          :place_lng => params[:place]["place_lng"],
          :place_ticket   => 0,
          :place_open => params[:place]["place_open"],
          :place_close => params[:place]["place_close"],
          :place_late=> params[:place]["place_late"],
          :place_address=> params[:place]["place_address"]
      }
    @place = Place.new(_place)
    #session[:user_id]
    _userpost={
        :user_id => 1,
        :post_id => post_id
    }
    saveUserPost(_userpost);
    _postcate={
      :post_id => post_id,
      :type_id => params[:post]["category_id"]
    }
    savePostCategories(_postcate);
     if @place.save
       redirect_to @place
      else
        render action: 'new'
      end
  end

  # PATCH/PUT /places/1
  # PATCH/PUT /places/1.json
  def update
    respond_to do |format|
      if @place.update(place_params)
        format.html { redirect_to @place, notice: 'Place was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end
# DELETE /places/1
  # DELETE /places/1.json
  def destroy
    @place.destroy
    respond_to do |format|
      format.html { redirect_to places_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.joins(:post).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params.require(:place).permit(:post_id, :place_lat, :place_lng, :place_ticket, :place_open, :place_close, :place_late, :place_choice)
    end
    #action load places filter by city, district,area, cate,cuisine, property,dide, purpose
    def method_name
      
    end
  def load_place_filter
    #All place none filter
    places    = Post.select("posts.id,
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
    check_filter  = false
    location_arr  = Array.new
    #Check city in filter
    if params[:allIds].present? && params[:allIds] !=''
      #places = places.where(:types => {:category_id=> params[:cityIds]})
      location_arr = {
        :ids  => params[:allIds],
        :name   => 'type_city'}
      check_filter =true
    end
    #Get all place of location
    if location_arr.present?
      check_filter =true
      places = places.where("posts.id in (?)",places.select("posts.id").where(:types => {:category_id=> location_arr[:ids],:type_name=> location_arr[:name]}) )
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
        :count  => _count,
        :places => return_place_ids(places,offset,limit)
        }
  end

  def return_place_ids(places, offset=0,limit=12)
    places_temp   =   places.offset(offset).limit(limit)

    arr     = Array.new 
    
    places_temp.each do |place|
      #filter category of place
      categories   =  filter_category place.id, 'type_category_place'
      arrCate    =  Array.new
      categories.each do |cate|
        arrCate << cate.type.category.cate_name
      end

      temp_place   =  {
        'post_id'     =>  place.id  ,
        'post_title'  =>  place.post_title  ,
        'post_content'  =>  place.post_content  ,
        'post_thumbnail'=>  place.post_thumbnail  ,
        'permalink'   =>  place.post_url,
        'avatar'    =>  place.post_thumbnail  ,
        'rating'    =>  place.post_view ,
        'post_view'   =>  place.post_view ,
        'post_review'   =>  place.post_review ,
        'post_point'  =>  place.post_point  ,
        'favorite'    =>  ''  ,
        'category'    =>  arrCate.to_sentence   ,
        'place_lat'   =>  place.place[0].place_lat,
        'place_lng'   =>  place.place[0].place_lng,
        'place_id'    =>  place.place[0].id,
        'location'    =>  place.place[0].place_address  ,
        'place_time'  =>  place.place[0].place_time,
        'place_open'  =>  place.place[0].place_open,
        'place_close' =>  place.place[0].place_close,
        'place_late'  =>  place.place[0].place_late,
        'place_choise'  =>  place.place[0].place_choice,
        'place_ticket'  =>  place.place[0].place_ticket,
        'place_min'   =>  place.place[0].place_min,
        'place_max'   =>  place.place[0].place_max
      }
      arr << temp_place
    end
    
    return arr
  end
  def filter_category (post_id ,type_name)
    postCategories  = PostCategory.select("*")
                     .joins(:type=>:category)
                     .where(:types => {:type_name => "#{type_name}"}, 'post_id' => "#{post_id}")
    return postCategories
  end
end
def savePost post
    if post.nil?
      return false
    end

    tmpPost = Post.new
     tmpPost.post_title    =   post[:post_title]
     tmpPost.post_content  =   post[:post_content]
     tmpPost.post_type     =   'type_place'
     tmpPost.post_view     =   0
     tmpPost.post_review   =   0
     tmpPost.post_point    =   0
    if tmpPost.save
      return tmpPost.id
    end
      puts "error save post"
    return false
  end
def saveUserPost usepost
    if usepost.nil?
      return false
    end

    tmpUserPost = UserPost.new
     tmpUserPost.post_id    =   usepost[:post_id]
     tmpUserPost.user_id    =   usepost[:user_id]
    if tmpUserPost.save
      return tmpUserPost.id
    end
      puts "error save UserPost"
    return false
  end
  def savePostCategories postcate
    if postcate.nil?
      return false
    end

    tmpPostCategory = PostCategory.new
     tmpPostCategory.post_id    =   postcate[:post_id]
     tmpPostCategory.type_id    =   postcate[:type_id]
    if tmpPostCategory.save
      return tmpPostCategory.id
    end
      puts "error save PostCategory"
    return false
  end