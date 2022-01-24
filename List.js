class List {
    constructor(name) {
        this.name = name;
        this.items = [];
    }
    addItem(name, price) {
        this.items.push(new Item(name, price));
    }
}
class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}
class ListService {
    static url = 'https://crudcrud.com/api/728b89b80066485ba4ef52bafb767ab2/list';

    static getAllLists() {
        return $.get(this.url);
    }
    static getList(id) {
        return $.get(this.url + `/${id}`);
    }
    static createList(list) {
       // return $.post(this.url, list);
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(list),
            contentType: 'application/json',
            type: 'POST'
        }); 
    }
    static deleteList(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
    static updateList(list) {
        return fetch( `${this.url}/${list._id}`, {
            method: 'PUT',
            headers : new Headers ({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({"name" : list.name, "items" : list.items}),
        });
       /* return $.ajax({
            url: this.url + `/${list._id}`,
            dataType: 'json',
            //data: JSON.stringify(list),
             data: JSON.stringify({
                "name" : list.name,
                "items" : list.items}),
                //"item" : StorageEvent.item}),
            contentType: 'application/json',
            type: 'PUT' 
        }); */
    };
}
class DOMManager {
    static lists;
    static getAllLists() {
        ListService.getAllLists().then(lists => this.render(lists));
    }
    static createList(name) {
        ListService.createList(new List(name))
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }
    static deleteList(id) {
        ListService.deleteList(id)
        .then(() => {
            return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }
    static addItem(id) {
        for (let list of this.lists) {
            if (list._id == id) {
                /* list.items.splice(list.items.indexOf(item), 0, new Item($(`#${list._id}-item-name`).val(), new Item($(`#${list._id}-item-price`).val())));
                console.log('Adding item:' + $(`#${list._id}-item-name`).val() + ' using .splice')
                ListService.updateList(list)
                .then(() => {
                    return ListService.getAllLists();
                })
                .then((lists) => this.render(lists)); */
                list.items.push(new Item($(`#${list._id}-item-name`).val(), $(`#${list._id}-item-price`).val()));
                console.log('Adding item:' + $(`#${list._id}-item-name`).val())
                ListService.updateList(list)
                    .then(() => {
                       // return DOMManager.getAllLists();
                   // }) 
                      return ListService.getAllLists();
                    })
                    .then((lists) => this.render(lists)); 
                    console.log("post update render");
            }
        }
    }
    static deleteItem(listId, itemName) {
        for (let list of this.lists) {
            if (list._id == listId) {
                for (let item of list.items) {
                    if (item.name == itemName) {
                        list.items.splice(list.items.indexOf(item), 1);
                        ListService.updateList(list)
                        .then(() => {
                            return ListService.getAllLists();
                        })
                        .then((lists) => this.render(lists));
                    }
                }
            }
        }
    }

    static render(lists) {
        this.lists = lists;
        $('#app').empty();
        for (let list of lists) {
            $('#app').prepend(
                `<div id="${list._id}" class="card">
                    <div class="card-header">
                        <h2>${list.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteList('${list._id}')">Delete</button>
                    </div>

                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${list._id}-item-name" class="form-control" placeholder="Item Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${list._id}-item-price" class="form-control" placeholder="Item Price">
                                </div>
                            </div>
                            <button id="${list._id}-new-item" onclick="DOMManager.addItem('${list._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div>
            </div><br>`
                ); 
            
            for (let item of list.items) {
                $(`#${list._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${item.name}"><strong>Name: </strong> ${item.name}</span>
                        <span id="price-${item.price}"><strong>Price: </strong> ${item.price}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteItem('${list._id}', '${item.name}')">Delete Items</button>
                        `
                );
            } 
        }
    }
}
$('#create-new-list').click(() => {
    DOMManager.createList($('#new-list-name').val());
    $('#new-list-name').val('');
});
DOMManager.getAllLists();