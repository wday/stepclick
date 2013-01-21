module ExperimentAnalyzer

	def ExperimentAnalyzer.compute_distance(data)
		results = []
		(1 .. data.length-1).each do |i|
			results << {
				"time"     		 => data[i]['time'],
				"frame"    		 => data[i]['frame'],
				"dx"       		 => data[i]['x'] - data[i-1]['x'],
				"dy"       	 	 => data[i]['y'] - data[i-1]['y'],
				"total_dx"  	 => data[i]['x'] - data[0]['x'],
				"total_dy"  	 => data[i]['y'] - data[0]['y'],
				"distance"       => ::ExperimentAnalyzer.euclidean_distance(data[i], data[i-1]),
				"total_distance" => ::ExperimentAnalyzer.euclidean_distance(data[i], data[0])
			}
		end
		return results
	end

	def ExperimentAnalyzer.euclidean_distance(a,b)
		Math.sqrt ( (a['x']-b['x'])**2 + (a['y']-b['y'])**2 )
	end
end
