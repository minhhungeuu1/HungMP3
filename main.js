const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = "PLAYER_STORAGE"

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const optionBtn = $('.option')
const optionList = $('.option-list')
const themeText = $('.theme-btn span')
const themeIcon = $('.theme-icon')
// Volume
const volumeBtn = $('.btn-volume')
const volumeWrap = $('.volume-wrap')
const volumeRange = $('.volume-range')
const volumeOutput = $('.volume-output')
// favorite box
const favoriteModal = $('.favorite_songs-modal')
const favoriteList = $('.favorite_songs-list')
const emptyList = $('.empty-list')
// Search
const searchBox = $('.search-box')
const searchInput = $('.search-bar')
const searchSongs = $('.search-songs')
// Xử lý cd-thumb quay và dừng
const cdThumbAnimate = cdThumb.animate([
    {
        transform: 'rotate(360deg)',
    }
], {
    duration: 20000,
    iterations: Infinity
})
cdThumbAnimate.pause()
// Mảng chứa index bài hát được thả tim
let likedList = []
// Mảng chứa index bài hát đã chạy random
let randomFilter = []
// Biến lưu query tất cả bài hát ở playlist để thực hiện searching
let songsList
const app = {
    currentIndex: 0,
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs : [
      {
        name: "LOVE ❤️",
        singer: "MH NU",
        path: "assets/music/AnhNangCuaAnh.mp3",
        image: "./assets/img/iu.jpg"
      },
      {
        name: "Anh đã làm gì đâu",
        singer: "Nhật Hoàng",
        path: "assets/music/anhDaLamGiDau.mp3",
        image:
            "./assets/img/anhDaLamGiDau.jpg"
      },
      {
        name: "Exit sign",
        singer: "HIEUTHUHAI",
        path: "assets/music/exitSign.mp3",
        image:
            "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/d/4/a/c/d4acc6335d41bd7164173312c6123706.jpg"
      },
      {
        name: "Mất kết nối",
        singer: "DƯƠNG DOMIC",
        path: "assets/music/matKetNoi.mp3",
        image:
            "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/c/9/7/9/c97982b6ae9f7a52196be520f6f25d46.jpg"
      },
      {
        name: "Cần gì nói iu!",
        singer: "Wxrdie",
        path: "assets/music/canGiNoiIu.mp3",
        image:
            "./assets/img/canGiNoiIu.jpg"
      },
      {
        name: "3107",
        singer: "W/n, DuongG, Nâu",
        path: "assets/music/3107.mp3",
        image:
            "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/a/2/6/ca266dd4fe3e3a296dd3a469c7972bf0.jpg"
      },
      {
        name: "Chăm hoa",
        singer: "Mono",
        path:
           "assets/music/chamHoa.mp3",
        "image": "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/4/1/1/f/411f660da310fea2a72d7ba147aa74d6.jpg"
      },
      {
        name: "Chẳng giống Giáng sinh",
        singer: "MCK",
        path:
           "assets/music/changGiongGS.mp3",
        "image": "./assets/img/changGiongGS.jpg"
      },
      {
        name: "Ngựa ô",
        singer: "DANGRANGTO, TEUYUNGBOY, DONAL",
        path:
           "assets/music/nguaO.mp3",
        "image": "./assets/img/nguaO.jpg"
      },
      {
        name: "Pin dự phòng",
        singer: "DƯƠNG DOMIC",
        path: "assets/music/pinDuPhong.mp3",
        image:
            "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/c/9/7/9/c97982b6ae9f7a52196be520f6f25d46.jpg"
      },
      {
        name: "Yêu em rất nhiều",
        singer: "Hoàng Tôn",
        path: "assets/music/yeuEmRatNhieu.mp3",
        image:
            "./assets/img/yeuEmRatNhieu.jpg"
      },
      {
        name: "Có hẹn với thanh xuân",
        singer: "MONSTAR & Grey D",
        path:
           "assets/music/coHenVoiThanhXuan.mp3",
        image:
            "./assets/img/coHenVoiTX.jpg"
      },
      {
        name: "Lần Hẹn Hò Đầu Tiên",
        singer: "Huyền Tâm Môn",
        path: "assets/music/lanHenHoDauTien.mp3",
        image:
            "./assets/img/lanHenHoDauTien.jpg"
      },
      {
        name: "Lệ Lưu Ly",
        singer: "Vũ Phụng Tiên & DT",
        path: "assets/music/leLuuLy.mp3",
        image:
            "./assets/img/leLuuLy.jpg"
      },
      {
        name: "Chúng ta của hiện tại",
        singer: "Sơn Tùng M-TP",
        path: "assets/music/chungTaCuaHienTai.mp3",
        image:
            "./assets/img/chungTaCuaHT.jpg"
      }
    ],
    render: function (songsArray, renderElm) {
        const htmls = songsArray.map((song, index) => {
            return `
                <div class= "song-node">
					<div class="song" data-index="${index}">
						<div class="thumb"
							style="background-image: url('${song.image}')">
						</div>
						<div class="body">
							<h3 class="title">${song.name}</h3>
							<p class="author">${song.singer}</p>
						</div>
						<div class="favorite">
							<i class="far fa-heart"></i>
						</div>
					</div>
                </div>    
				`
        })
        renderElm.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    // Chuẩn hóa chuỗi sang unicode format
    removeAccents: function (str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // nhấn space để phát/dừng bài hát
        document.onkeydown = function (e) {
            e = e || window.event;
            // use e.keyCode
            if(e.code === "Space" && e.target === document.body){
                e.preventDefault()
                if (_this.isplaying) {
                    audio.pause()
                } else audio.play()
            }
        };

        // Click outside then close the opening box
        document.onclick = function (e) {
            if (!e.target.closest('.option')) {
                optionList.style.display = null
            }
            if (!e.target.closest('.btn-volume')) {
                volumeWrap.style.display = null
            }
            if (!e.target.closest('.search-box')) {
                searchSongs.style.display = null
                searchInput.setAttribute('style', 'border-bottom-right-radius: null; border-bottom-left-radius: null')
            }
        }

        // Xử lý scale cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //#region Searching  
        searchBox.onclick = function () {
            searchSongs.style.display = 'block'
            searchInput.setAttribute('style', 'border-bottom-right-radius: 0; border-bottom-left-radius: 0')
            // Biến lưu query tất cả bài hát ở playlist để thực hiện search
            songsList = $$('.song-node')
        }
        searchInput.oninput = function () {
            let searchValue = searchInput.value
            if (!searchValue) {
                searchSongs.innerHTML = ''
                return
            }
            let searchResult = [] 
            songsList.forEach(song => {
                let copySong = song.cloneNode(true)
                let songInfo = _this.removeAccents(copySong.innerText).toUpperCase()
                searchValue = _this.removeAccents(searchValue).toUpperCase()
                if(songInfo.includes(searchValue)) {
                    searchResult.push(copySong.innerHTML)
                }
            })
            searchSongs.innerHTML = searchResult.join('')
        }
        searchSongs.onclick = (e) => {
            playlist.onclick(e)
        }
        //#endregion Searching

        // #region Volume
        // Bật tắt volume
        volumeBtn.onclick = function () {
            volumeWrap.style.display = !Boolean(volumeWrap.style.display) ? 'block' : null
        }
        volumeWrap.onclick = function (e) {
            e.stopPropagation()
        }
        // Drag volume range
        volumeRange.oninput = function (e) {
            audio.volume = e.target.value / 100
            volumeOutput.textContent = e.target.value
            _this.setConfig('volume', e.target.value)
        }
        // #endregion Volume

        // #region Options
        // Show option list 
        optionBtn.onclick = function (e) {
            optionList.style.display = !Boolean(optionList.style.display) ? 'block' : null
        }
        optionList.onclick = function (e) {
            // Chuyển mode sáng tối
            if (e.target.closest('.theme-btn')) {
                themeIcon.classList.toggle('fa-sun')
                $('body').classList.toggle('dark')
                themeText.textContent = themeIcon.matches('.fa-sun') ? 'Light mode' : 'Dark mode'
                _this.setConfig('classDark', $('body').className)
                e.stopPropagation()
            } else {
                // Mở box favorite song
                favoriteModal.style.display = 'flex'
                $('body').style.overflow = 'hidden'
                emptyList.style.display = favoriteList.childElementCount > 0 ? 'none' : null
            }
        }
        //#endregion Options

        // #region Favorite songs
        // Xử lý bấm vào nút close và ra ngoài thì đóng favorite box
        favoriteModal.onclick = function (e) {
            if (e.target.matches('.favorite_songs-close') || e.target.matches('.favorite_songs-modal')) {
                favoriteModal.style.display = null
                $('body').style.overflow = null
            } else {
                playlist.onclick(e)
            }
            emptyList.style.display = favoriteList.childElementCount > 0 ? 'none' : null
        }
        //#endregion Favorite Songs

        // #region Play button
        // Xử lý khi người dùng click vào play button
        playBtn.onclick = function () {
            if (_this.isplaying) {
                audio.pause()
            } else audio.play()
        }
        audio.onplay = function () {
            _this.isplaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isplaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else nextBtn.click()
        }
        // #endregion Play button

        // #region Progress bar
        // Khi tiến độ bài hát thay đổi => thanh progress cũng thay đổi tương ứng
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // Percent of progress
                const progressPercent = (audio.currentTime / audio.duration) * 100
                progress.value = progressPercent
                _this.setConfig('songCurrentTime', audio.currentTime)
                _this.setConfig('songProgressValue', progress.value)
            }
        }
        // Xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }
        // #endregion Progress bar

        // #region Controllers: Next, Prev, Random, Repeat buttons
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else _this.nextsong()
        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else _this.prevsong()
        }
        
        // Bật tắt nút random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Bật tắt nút repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // #endregion Controllers

        // #region Playlist : click on songs
        // CLick vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const favoriteIcon = e.target.closest('.favorite i')
            if (!favoriteIcon) {
                // Xử lý khi click để chuyển bài hát
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
            } else {
                // Xử lý khi thả tim hoặc bỏ tim
                // Từ icon đã nhấn tim, trỏ tới Parent song của icon đó 
                let favoriteSong = favoriteIcon.closest('.song')
                _this.handleLikedList([favoriteSong.dataset.index])
                _this.setConfig('likedListIndex', likedList)
            }
        }
        // #endregion Playlist
    },

    // Xử lý danh sách bài hát yêu thích
    handleLikedList: function (favSongsIndex) {
        // Duyệt mảng vị trí các bài hát đã bấm tim, nếu like thì thêm vào favorite box
        // bỏ like thì xóa khỏi favorite box, áp dụng cho cả loadconfig 
        favSongsIndex.forEach(function (index) {
            let favoriteSong = $$(`.song[data-index="${index}"]`)
            if (!favoriteSong.length) return
            favoriteSong.forEach(song => {
                song.classList.toggle('liked')
                song.querySelector('i').classList.toggle('fas')
            })
            favoriteSong = favoriteSong[0]
            if (favoriteSong.matches('.liked')) {
                favoriteList.appendChild(favoriteSong.cloneNode(true))
                likedList.push(index)
            } else {
                let removeSong = $(`.favorite_songs .song[data-index="${index}"]`)
                removeSong.remove()
                likedList.splice(likedList.indexOf(index), 1)
            }
        })
    },
    // Focus, cuộn tới bài hát đang phát
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.playlist .song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            })
        }, 300)
    },

    //#region Controllers: Next, Prev, Random
    nextsong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) { this.currentIndex = 0 }
        this.loadCurrentSong()
        audio.play()
    },
    prevsong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) { this.currentIndex = this.songs.length - 1 }
        this.loadCurrentSong()
        audio.play()
    },
    playRandomSong: function () {
        if(this.songs.length < 2) return
        let newIndex = this.currentIndex

        if (randomFilter.length == 0) {
            randomFilter.push(this.currentIndex)
        } else if (randomFilter.length == this.songs.length) {
            randomFilter.length = 0
            randomFilter.push(this.currentIndex)
        }

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (randomFilter.includes(newIndex))

        this.currentIndex = newIndex
        this.loadCurrentSong()
        audio.play()

        randomFilter.push(this.currentIndex)
    },
    //#endregion Controllers

    // Load bài hát hiện tại
    loadCurrentSong: function () {
        // Load Song Info
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        // Add active class to Current Song on playlist and Favorite
        const activeSongs = $$('.song.active')
        const currentActiveSongs = $$(`.song[data-index= "${this.currentIndex}"]`)
        currentActiveSongs.forEach(activeSong => {
            activeSong.classList.add('active')
        })
        activeSongs.forEach(activeSong => {
            if (activeSong && activeSong.matches('.active')) {
                activeSong.classList.remove('active')
            }
        });

        // Lưu bài hát hiện tại vào localStorage
        this.setConfig('currentSongIndex', this.currentIndex)
        // scroll to current song
        this.scrollToActiveSong()
    },
    // Load cấu hình đã lưu mỗi khi reload trang
    loadConfig: function () {
        this.isRandom = this.config.isRandom || false
        this.isRepeat = this.config.isRepeat || false
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        this.currentIndex = this.config.currentSongIndex || 0
        progress.value = this.config.songProgressValue || 0
        audio.currentTime = this.config.songCurrentTime || 0
        // Load theme
        if (this.config.classDark) {
            themeIcon.classList.toggle('fa-sun')
            $('body').classList.toggle('dark')
            themeText.textContent = themeIcon.matches('.fa-sun') ? 'Light mode' : 'Dark mode'
        }
        // Load volume
        audio.volume = this.config.volume / 100 || 1
        volumeRange.value = this.config.volume || 100
        volumeOutput.textContent = this.config.volume || '100'
        // Load likedList
        if ('likedListIndex' in this.config && this.config.likedListIndex.length) {
            this.handleLikedList(this.config.likedListIndex)
        }
    },
    
    start: function () {
        this.defineProperties()
        // xử lý các sự kiện (Dom Events)
        this.handleEvents()
        // render bài hát vào playlist
        this.render(this.songs, playlist)
        // Gán cấu hình đã lưu từ config vào Object
        this.loadConfig()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong()
    }
}
app.start()
