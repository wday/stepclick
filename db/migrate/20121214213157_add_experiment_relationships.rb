class AddExperimentRelationships < ActiveRecord::Migration

	def change
		add_column :experiments, :videoclip_id, :integer
	end

end
