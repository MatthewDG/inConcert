 # inConcert

Heroku Link: [inConcert]
Trello Link: [trelloBoard](https://trello.com/b/4SNQRXjd/inconcert)

[inConcert]: #;

## Minimum Viable Product

inConcert is a web application inspired by Vimeo built using Ruby on Rails and React/Redux. By the end of Week 9, this app will, at the minimum, satisfy the following criteria.

### Major Features
- [X] Hosting on Heroku
- [X] New account creation, login, and demo login
- [X] Videos
  * Users should also have the ability to upload videos
  * Splash page with global video index
    - [X] "Staff" Picks
      - [ ] Implement filters & sorting
    - [X] Most Watched (views),
      - [ ] Implement filters & sorting
    - [X] Most Popular (likes),
      - [ ] Implement filters & sorting
    - [X] Sideways scrolling on each video list on the splash
- [X] Comments
  * Users should have the ability to comment on videos
- [X] Likes
  * Users should be able to like a Video
- [ ] Video Searching
  * Users should be able to search videos by title
- [ ] Production README
- [ ] Adequate styling constructive to the user's experience.
- [ ] Smooth, bug-free navigation
- [ ] Adequate and appropriate seeds to demonstrate features


### Bonus Features
- [ ] Stylized video player components
- [ ] User created playlists
- [X] User Show Page
    - [X] User's uploaded videos
    - [X] User's likes
    - [ ] User's playlists
    - [ ] Recommended
- [ ] Nested Comments (Can reply to comments)
- [ ] Option to assign categories to videos
- [ ] Assign video production credits to other users
- [ ] Responsive layout



## Design Docs
* [View Wireframes][wireframes]
* [React Components][components]
* [API endpoints][api-endpoints]
* [DB schema][schema]
* [Sample State][sample-state]

[wireframes]: wireframes
[components]: component-hierarchy.md
[sample-state]: sample-state.md
[api-endpoints]: api-endpoints.md
[schema]: schema.md

## Implementation Timeline

### Phase 0: Setup

- [X] Initialize git repository
- [X] Install figaro, paperclip video gems
- [X] Install videojs package
- [X] Get up and running with Amazon Web Services

### Phase 1: Backend Setup and Front End User Authentication (1 Day)

**Objective:** Functioning user authentication

- [X] New Rails Project
- [X] User model/migration
- [X] Back end Authentication
- [X] 'StaticPages' Controller and Root View
- [X] 'Webpack' and react/redux modules
- [X] APIUtil setup to interact with the backend API
- [X] Redux cycle for frontend authentication
- [X] User signup/signin components
- [X] Blank landing component after signup/signin
- [X] Style signup/signin components
- [X] User Seed

### Phase 2: Video Model, API, and Components (3 Days)
**Objective:** Video can be created and updated through the API and by Users

- [X] Video Model
- [X] Seed database with video data. (never hurts to upload more!)
- [X] CRUD API for videos
- [X] JBuilder views to format videos appropriately
- Video components and respective Redux loops
  - [X] 'Video Index'
    - Main splash page with videos listed.
  - [X] 'Video Index Row'
    - Row of videos with Sideways Scrolling
  - [X] 'Video Form'
    - Video upload form.
      - [ ] Upload spinner
      - [X] With drag & drop!
    - [X] Video edit form
  - [X] 'Video Show Page'
    - Watch a Video
    - View count updates for each render

### Phase 3: Comment Model, API, and Components (2 Days)
**Objective:** Comments can be created and updated through the API and by Users. These comments are owned by a User and by a Video.

- [X] Comment Model
- [X] Seed database with Comments
- [X] CRUD API for comments
- [X] JBuilder views to format the comment data appropriately
- Comment components and respective Redux loops
  - [X] 'Comment Index' Per video
    - Lists on the Video show page
    - Ordered by date authored, descending.
  - [X] 'Comment Item'
    - Individual comments displayed
  - [X] 'Comment Form'
    - Add a comment to the video

### Phase 4: Likes Model, API, and Components (1 Day)
**Objective:** Users should be able to "Like" a video.

- [X] Likes Model
- [X] Seed database with Likes
- [X] CRD API for Likes
- [X] Jbuilder views to format the likes data
- Likes components and respective Redux loops
  - [X] 'Video Likes'

### Phase 5: Video Searching (2 Days)
**Objective:** Video can be searched by title via the search bar.

- [X] Video search bar component
  - [ ] Search suggestion item components
- [X] JBuilder views to format videos appropriately
  - [X] This also means to update your controller to take in search queries!
- [X] Video search result page
  - Video
    - Title
    - Username
    - View Count

### Bonus Phase 1: User Profile Page
**Objective:** Add user profile page displaying their uploaded videos, liked videos and playlists.

- [X] User show page with up to 6 most recently uploaded videos and about me description
- [ ] Edit user profile info
- [ ] Give users an data upload quota
- [X] Page displaying user's liked videos

### Bonus Phase 2: Playlists
**Objective:** Allow users to create playlists and add videos to it

- [ ] Playlists model
- [ ] Playlist Videos join model
- [ ] CRUD API for Playlists
- [ ] Jbuilder views to format the playlist data
- [ ] Playlist show page
  - Up Next list
  - Autoplay next video option with toggle
- [ ] Integrate playlist section into user's profile

### Bonus Phase ∞
- [ ] Nested comments
- [ ] Uploader can give videos categories
  - [ ] Search for videos by category
- [ ] Uploader can tag other users as collaborators (credits)
  - [ ] Video credits show up in user's profile
- [ ] Watch Later
- [ ] Personalized feed
  - [ ] User follows
