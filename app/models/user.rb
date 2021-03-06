# == Schema Information
#
# Table name: users
#
#  id                  :integer          not null, primary key
#  username            :string           not null
#  password_digest     :string           not null
#  session_token       :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  avatar_file_name    :string
#  avatar_content_type :string
#  avatar_file_size    :integer
#  avatar_updated_at   :datetime
#

class User < ActiveRecord::Base

  has_attached_file :avatar, default_url: "demo-avatar.png",
  :styles => {
      :nav => "32x32>",
      :video_item  => "16x16>",
      :comment => "40x40>"},
    :s3_protocol => :https

  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

  validates :username, :password_digest, :session_token, presence: true
  validates :username, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  attr_reader :password
  after_initialize :ensure_session_token

  has_many :videos
  has_many :likes

  has_many :liked_videos, through: :likes, source: :video

  def self.generate_random_session_token
    SecureRandom.urlsafe_base64(16)
  end

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return user if user && user.is_password?(password)
    nil
  end

  def ensure_session_token
    self.session_token ||= User.generate_random_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_random_session_token
    self.save
    self.session_token
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
end
