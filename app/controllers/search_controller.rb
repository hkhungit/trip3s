class SearchController < ApplicationController
	layout "trip3s"
  def index
  	@places = Place.all
    @posts  = Post.select("*").joins(:place).order('post_view desc').limit(4)
    @places_category = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'}).limit(10)
    @places_cate_all=Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place',:type_name => 'type_city',:type_name => 'type_district',:type_name => 'type_area',:type_name => 'type_diding_place',:type_name => 'type_property_place',:type_name => 'type_cuisine_place',:type_name => 'type_purpose_place'}).limit(10)
   # @places_two_limit_one=Post.find_by_sql ["select A.id,A.post_title, A.post_review,A.post_view,B.place_choice,B.place_address,A.post_url,A.post_thumbnail from posts A,places B WHERE A.post_title like ? and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC limit 10", "%#{params[:search]}%"]
   sql = " select A.id,A.post_title, A.post_review,A.post_view,B.place_choice,B.place_address,A.post_url,A.post_thumbnail,B.post_id from posts A,places B WHERE A.post_title like '%#{params[:search]}%' and A.id=B.post_id and A.id in (select id FROM posts ORDER by post_review DESC) ORDER by B.place_choice DESC"
   	@places_two_limit_one=Post.paginate_by_sql(sql, :page => params[:page], :per_page => 5)
  end
end
