json.extract! comment, :id, :video_id, :user_id, :body

json.author do
  json.partial! './api/users/user', { user: comment.user }
end