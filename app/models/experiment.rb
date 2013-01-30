class Experiment < ActiveRecord::Base
	belongs_to :videoclip # has remote key :videoclip_id, and can do experiment.videoclip to lookup clip by id
	#has_many :data # Datum model has key :experiment_id can do datum.e or e.data to use association
	has_many :particles
	has_one :scale
end
