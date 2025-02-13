require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', (req, res) => {
    res.render('home_page')

})
app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            const items = data.body.artists.items

            res.render('artist-search-results', { items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId, { limit: 10 })
        .then(data => {
            const albums = data.body.items
            console.log(albums);

            res.render('albums', { albums })
        })
        .catch(err => console.log('The error while showing albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then(data => {
            const tracks = data.body.items
            console.log(tracks);

            res.render('tracks', { tracks })

        })
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
