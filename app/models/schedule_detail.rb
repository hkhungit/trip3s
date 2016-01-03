class ScheduleDetail < ActiveRecord::Base
  belongs_to :place
  belongs_to :schedule

  def next
    schedule.schedule_detail.where("id > ?", id).first
  end

  def prev
    schedule.schedule_detail.where("id < ?", id).last
  end

end
