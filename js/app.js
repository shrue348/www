var data = {
	query: '',
	apiKey: '72b56103e43843412a992a8d64bf96e9',
	thumb: 'http://image.tmdb.org/t/p/w500',
	errorMsg: '',
	currentPage: 1,
	pagination: {
		numList: [],
		limit: '5',
		from: '',
		to: '',
		itemsPerPage: ''

	},
	searchResult: []
};


var app = new Vue({
	el: '#app',
	data: data,
	methods: {
		searchQuery: function() {
			var searchLine = 'https://api.themoviedb.org/3/search/movie' +
							 '?api_key='+ this.apiKey +
							 '&query='+ this.query +
							 '&page=' + this.currentPage +
							 '&language=ru';

			if (this.query){
				this.$http.get( searchLine, function(data, status, request){
					if(status == 200){
						this.searchResult = data;

						if ( data.total_results == 0){
							this.errorMsg = 'Ничего не найдено =(';
						}

						this.pagiForm();

						console.log(this.searchResult)
					} else {
						this.errorMsg = 'Ошибка подключения к серверу';
					}
				});
			} else {
				this.searchResult = [];
				this.errorMsg = 'Введите название фильма';
			};

			
		},
		pagiNext: function(){
			if ( this.currentPage < this.searchResult['total_pages'] ){
				this.currentPage = this.currentPage +1;
				this.searchQuery();
				this.pagiForm();
			} else {
				return false
			}
		},
		pagiPrev: function(){
			if ( this.currentPage > 1 ){
				this.currentPage = this.currentPage -1;
				this.searchQuery();
			} else {
				return false
			}
		},
		pageGo: function(n){
			this.currentPage = n;
			this.searchQuery();
		},
		pagiForm: function(){
			var half = Math.floor(this.pagination.limit / 2);

			if ( this.pagination.limit > this.searchResult.total_pages) { //ели страниц меньше чем лимит пагинации
				this.pagination.limit = this.searchResult.total_pages
			}

			if ( this.currentPage <= half) { //если текущая страница в начале пагинации
				this.pagination.from = 1
			} else if ( this.currentPage >= (this.searchResult.total_pages - half)) { //если текущая страница в конце пагинации
				this.pagination.from = this.searchResult.total_pages - this.pagination.limit +1
			} else {
				this.pagination.from = this.currentPage - half
			}

		  	this.pagination.to = parseFloat(this.pagination.from) + parseFloat(this.pagination.limit) - 1;
			this.pagination.numList = [];

			for (var i=this.pagination.from ; i <= this.pagination.to; i++) {
				this.pagination.numList.push(i)
			}
		},
		openItem: function(item_id){
			var searchLine = 'https://api.themoviedb.org/3/movie/' +
							item_id +
							'?api_key='+ this.apiKey +
							'&language=ru';

			if (item_id){
				this.$http.get( searchLine, function(data, status, request){
					if(status == 200){
						this.searchResult = data;

						if ( data.total_results == 0){
							this.errorMsg = 'Ничего не найдено =(';
						}

						console.log(this.searchResult)
					} else {
						this.errorMsg = 'Ошибка подключения к серверу';
					}
				});
			} else {
				this.searchResult = [];
				this.errorMsg = 'Почему то не открывается';
			};
		},
		init: function(){

		}
	}
});

app.init();