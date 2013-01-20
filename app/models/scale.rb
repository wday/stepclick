class Scale < ActiveRecord::Base
	belongs_to :experiment

	def x(xprime)
		xprime * measured_length;
	end

	def y(yprime)
		yprime * measured_length;
	end
end
