class Admin::BaocaoController < ApplicationController
	layout "admin"
  def diadiem
  	  sql = " select A.id,A.post_title, A.post_review,A.post_view,B.place_choice,B.place_address,A.post_url,A.post_thumbnail,B.post_id from posts A,places B WHERE A.id=B.post_id ORDER by B.place_choice DESC"
   		@places_top=Place.paginate_by_sql(sql, :page => params[:page], :per_page => 10)
   		 sql1 = " select A.id,A.post_title, A.post_review,A.post_view,B.place_choice,B.place_address,A.post_url,A.post_thumbnail,B.post_id from posts A,places B WHERE A.id=B.post_id ORDER by A.post_review DESC"
   		@places_top_review=Place.paginate_by_sql(sql1, :page => params[:page], :per_page => 10)
  end
  def kehoach
  		 sql2 = " select A.id,A.post_title, A.post_review,A.post_view,B.place_choice,B.place_address,A.post_url,A.post_thumbnail,B.post_id from posts A,places B WHERE A.id=B.post_id and A.id ORDER by A.post_review DESC"
   		@places_top_review=Place.paginate_by_sql(sql1, :page => params[:page], :per_page => 10)
  end
end
