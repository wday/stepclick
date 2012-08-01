class Frame < ActiveRecord::Base
  belongs_to :videoclip

  def previous_framenum(clip)
    f = Frame.where('frames.videoclip_id = ? AND frames.framenum < ?', clip.id, self.framenum).order('frames.framenum DESC').first
    if f
      return f.framenum
    else
      return nil
    end
  end

  def next_framenum(clip)
    f = Frame.where('frames.videoclip_id  = ? AND frames.framenum > ?', clip.id, self.framenum).order('frames.framenum ASC').first
    if f
      return f.framenum
    else
      return nil
    end
  end

end
