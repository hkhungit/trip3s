class Category < ActiveRecord::Base
	has_many :type

	def planCount
		return 1
	end
end
