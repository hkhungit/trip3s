class ScheduleDetail < ActiveRecord::Base
  belongs_to :place
  belongs_to :schedule
end
