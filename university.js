let prom = fetch('http://universities.hipolabs.com/search?country');
prom.then((res)=>{
    if(res.ok){
        console.log('Successfully fetched')
    }else{
        console.log('Failed to fetch')
    }
    return res.json();
}).then((res)=>{
    var state={
        'querySet': res,
        'page': 1,
        'cards': 8,
    };
    function pagination(querySet, page, cards){
        var trimStart = (page-1) * cards
        var trimEnd = trimStart + cards
        var trimData = querySet.slice(trimStart, trimEnd)
        var pages = Math.round(querySet.length/cards);
        return{
            'querySet': trimData,
            'pages': pages,
        };
    }
    console.log(pagination(state.querySet, state.page, state.cards))
    var paginationData = pagination(state.querySet, state.page, state.cards)
    var cardData = paginationData.querySet

    var cardContainer = document.getElementById('cardContainer');
    var data = '';
    cardData.forEach((item)=>{
        data+= `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${item.country}</h6>
                    <p class="card-text">Country Alpha Code: ${item.alpha_two_code}</p>
                    <p class="card-text">State Province: ${item['state-province']}</p>
                    <a href="${item['web_pages']}" class="btn btn-primary">Click to visit</a>
                </div>
            </div>
        `;
    });
    cardContainer.innerHTML= data;
    
    var labelPage = document.querySelector('.current_page');
    labelPage.textContent = `Current Page: ${state.page}`;
    var labelTotal = document.querySelector('.total_page');
    labelTotal.textContent = `Total Pages: ${paginationData.pages}`;

    const fetchPage = (event, page) => {
        state.page = page || event.target.getAttribute('data-value');
        var paginationData = pagination(state.querySet, state.page, state.cards)
        var cardData = paginationData.querySet;
        var updatedData = '';
        cardData.forEach((item)=>{
            updatedData+= `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${item.country}</h6>
                        <p class="card-text">Country Alpha Code: ${item.alpha_two_code}</p>
                        <p class="card-text">State Province: ${item['state-province']}</p>
                        <a href="${item['web_pages']}" class="btn btn-primary">Click to visit</a>
                    </div>
                </div>
            `;
        });
        cardContainer.innerHTML = updatedData;
        updateActiveButton();

        var labelPage = document.querySelector('.current_page');
        labelPage.textContent = `Current Page: ${state.page}`;
    }

    const updateActiveButton = () => {
        var buttons = document.querySelectorAll('.mainBtns');
        if (buttons !== null) {
            buttons.forEach((button) => {
                button.classList.remove('active');
            });
            var currentPageButton = document.querySelector('.mainBtns[data-value="' + state.page + '"]');
            if (currentPageButton !== null) {
                currentPageButton.classList.add('active');
            }
        }
    };
      
    const fetchPrevPage = () => {
        if (state.page > 1) {
            state.page--;
            if (state.page < paginationData.pages - 8) {
              pageButtons(paginationData.pages);
            }
            fetchPage(null, state.page);
            updateActiveButton();
        }
    }
    
    const fetchNextPage = () => {
        if (state.page < paginationData.pages) {
            state.page++;
            if (state.page > 9) {
              pageButtons(paginationData.pages);
            }
            fetchPage(null, state.page);
            updateActiveButton();
        }
    }

    const pageButtons=(pages)=>{
        var btn_wrapper = document.getElementById('pageWrapper');
        btn_wrapper.innerHTML = ''
        var maxButtons = 9; // Maximum number of buttons to display
        var start = Math.max(1, state.page - Math.floor(maxButtons / 2));
        var end = Math.min(start + maxButtons - 1, pages);

        var prevButton = document.createElement('button');
        prevButton.setAttribute('id', 'prev');
        prevButton.textContent= 'Prev';
        prevButton.addEventListener('click', fetchPrevPage);
        btn_wrapper.appendChild(prevButton);

        for (let page = start; page <= end; page++) {
            var button = document.createElement('button')
            button.setAttribute('class', 'mainBtns');
            // button.value = page
            button.setAttribute('data-value', page);
            button.textContent = page
            button.addEventListener('click', fetchPage);
            btn_wrapper.appendChild(button);
        }
        var nextButton = document.createElement('button');
        nextButton.setAttribute('id','next');
        nextButton.textContent='Next';
        nextButton.addEventListener('click', fetchNextPage);
        btn_wrapper.appendChild(nextButton);

        var searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'number')
        searchInput.setAttribute('id', 'pageNo');
        searchInput.setAttribute('min', '1')
        searchInput.setAttribute('max', paginationData.pages)
        searchInput.setAttribute('placeholder', 'Enter page')
        btn_wrapper.appendChild(searchInput)

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                var pageNumber = parseInt(searchInput.value);
                if (pageNumber >= 1 && pageNumber <= paginationData.pages) {
                    // pageNumber = state.page
                    fetchPage(null, pageNumber);
                } else {
                    console.log('Invalid page number');
                }
                pageButtons(paginationData.pages)
            }
        });
        updateActiveButton();
    }
    pageButtons(paginationData.pages)
    console.log('Fetched everything now you can grab a cup of coffee!!')

}).catch((Error)=>{
    console.log('Something went wrong')
})