class Scale < ActiveRecord::Base
	belongs_to :experiment

	# For xprime in screen units (px), we compute
	# x[units] = xprime [px] * [units] / [px]
	def x(xprime)
		xprime * measured_length / lengthprime;
	end

	def y(yprime)
		yprime * measured_length / lengthprime;
	end

	def lengthprime
		Math.sqrt (y1 - y0)*(y1 - y0) + (x1 - x0)*(x1 - x0)
	end

end
