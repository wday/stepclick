module ExperimentAnalyzer

	def ExperimentAnalyzer.compute_derivative(data)
		results = []
		(1 .. data.length-1).each do |i|
			results << {
				"time"     		 => data[i]['time'],
				"frame"    		 => data[i]['frame'],
				"dx"       		 => data[i]['x'] - data[i-1]['x'],
				"dy"       	 	 => data[i]['y'] - data[i-1]['y'],
			}
		end
		return results
	end


	def ExperimentAnalyzer.compute_distance(data)
		results = []
		(1 .. data.length-1).each do |i|
			results << {
				"time"     		 => data[i]['time'],
				"frame"    		 => data[i]['frame'],
				"distance"       => ::ExperimentAnalyzer.euclidean_distance(data[i], data[0]),
			}
		end
		return results
	end

	def ExperimentAnalyzer.compute_normalized_position(data)
		results = []
		(1 .. data.length-1).each do |i|
			results << {
				"time"     		 => data[i]['time'],
				"frame"    		 => data[i]['frame'],
				"x"              => data[i]['x'] - data[0]['x'],
				"y"              => data[i]['y'] - data[0]['y']
			}
		end
		return results
	end

	def ExperimentAnalyzer.euclidean_distance(a,b)
		Math.sqrt ( (a['x']-b['x'])**2 + (a['y']-b['y'])**2 )
	end
end
