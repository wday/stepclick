# Temporary model used for creating plottable data for all particles in an experiment
#
# this is a bad idea for just wanting to plot multiple lines since it requires they can
# all be aligned into matching rows. Keeping around because it is a useful idea for
# some type of analyses (if fixed)
class ParticleData
  def init(particles, colids)
  	particles.each do |p|
  		p.data.each do |d|
  			colids.each do |id|
	  			this.instance_eval {
	  				dyn_id  = p.name + "_" + id
	  				dyn_val = d[id]
	  				attr_accessor p.name + id
	  				this[dyn_id] = dyn_val
	  			}
		end
  	end
  end

  def test_create
  	n = 10 #
  	(1...n).each do |row|
  		['foo','bar'].each do |particle|
  			p = ParticleData.new
  			['x','y'].each do |column_id|
	  			p.instance_eval {
	  				dyn_id  = particle + "_" + column_id
	  				dyn_val = [id]
	  				attr_accessor p.name + id
	  				this[dyn_id] = dyn_val
	  			}
		end
  	end
  end
end
