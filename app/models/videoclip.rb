require 'open3'
require 'uuid'

class Videoclip < ActiveRecord::Base

	def soft_delete()
		update_attribute(:is_removed, 1)
	end

  def create_frames(vidpath)
    logger.info "[create_frames] starting: create_frames for id: #{vidpath}"

    frame_directory_path = File.join("public","data","video",vidpath,"frame")
    frame_path = File.join(frame_directory_path,"%04d.jpg")
    clip_path  = File.join("public","data","video",vidpath,"videoclip")

		logger.info "[create_frames] extracting video parameters"
    Open3.popen3('ffprobe',clip_path) do |stdin, stdout, stderr|
      while (line = stderr.gets)
				logger.info line.chomp
				if m = line.match(/(\d+[\.]{0,1}[\d]{0,9}) fps/)
					fps_cap = m.captures.first
        	update_attribute(:fps, fps_cap.to_f)
					update_attribute(:fpss, fps_cap)
					logger.info "[create_frames] #{fps_cap}"
				end
      end
    end

		logger.info "[create_frames] processing video with ffmpeg"
    logger.info "[create_frames] executing: ffmpeg -i #{clip_path} -sameq #{frame_path}"
    Open3.popen3('ffmpeg','-i',clip_path,'-sameq',frame_path) do |stdin, stdout, stderr|
      while (line = stderr.gets)
				logger.info line.chomp
      end
    end
    # TODO error checking: see if conversion failed or something
		# TODO do this in a thread and don't block
    
    # Frame objects belong_to videoclip with the foreign key :videoclip_id
    Dir[File.join(frame_directory_path,"*.jpg")].each do |framefile|
      logger.info "[create_frames] linking: #{framefile}"
      # FIXME fragile, depends on knowing files end in .jpg
      seqid = File.basename(framefile)[0..-5].to_i
      frame = Frame.create(:videoclip_id => self.id, :framenum => seqid)
    end

    self.update_attribute(:is_processed, 1)
    
    # TODO add update_attribute(:max_frame, )
    # TODO add update_attribute(:min_frame, )
    # self.update_attribute(:framenum_max, Frame.where('frames.videoclip_id = ?', self.id).order('frames.framenum DESC').first)
    # self.update_attribute(:framenum_min, Frame.where('frames.videoclip_id = ?', self.id).order('frames.framenum ASC').first)
  end

  def store_datafile(datafile,uuidpath)
    origname  = datafile.original_filename
    directory = "public/data/video/#{uuidpath}/"

    Dir.mkdir(directory)
    Dir.mkdir(File.join(directory, "frame"))

    path = File.join(directory, "videoclip")

    File.open(path,"wb") do |f|
      f.write(datafile.read)
    end
  end

  def get_video_parameters

    # scan the ffmpeg output to determine the resolution, fps, and duration of the video
    Open3.popen3('ffmpeg','-i',@path) do |stdin, stdout, stderr|
      while (line = stderr.gets)
        # do stuff
      end
    end

    update_attribute(:width,  width)
    update_attribute(:height, height)
    update_attribute(:frames, video.duration)
  end
end
