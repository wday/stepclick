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

	def get_scaled(data)
		results = []
		data.each do |datum|
			results << {
				"frame" => datum.frame,
				"time" => datum.time,
				"x" => x( datum.x ),
				"y" => y( datum.y )
			}
		end
		return results
	end
end
