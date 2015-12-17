class ListController < ApplicationController
	layout "trip3s"
  def index
  	@post_places=Post.all.paginate(page: params[:page])
  	@places = Place.all
    @posts  = Post.select("*").joins(:place).order('post_view desc').limit(4)
    @places_category = Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place'}).limit(10)
    @places_cate_all=Category.select("*").joins(:type).where(:types => {:type_name => 'type_category_place',:type_name => 'type_city',:type_name => 'type_district',:type_name => 'type_area',:type_name => 'type_diding_place',:type_name => 'type_property_place',:type_name => 'type_cuisine_place',:type_name => 'type_purpose_place'}).limit(10)
   
  end
end
