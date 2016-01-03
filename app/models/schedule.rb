class Schedule < ActiveRecord::Base
  belongs_to :plan
  has_many :schedule_detail
end
