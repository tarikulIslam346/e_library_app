import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Choice } from '../book-issue/choice';
import { Book } from '../model/book';
import { BookIssue } from '../model/bookIssue';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { fileUpload } from '../commonUrl';
import { BookIssueList } from '../model/bookIssueList';
// import { MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-book-issue',
  templateUrl: './book-issue.component.html',
  styleUrls: ['./book-issue.component.css']
})

export class BookIssueComponent implements OnInit {

  // @ViewChild(MatCheckbox)
  // checkBook:MatCheckbox
  memberName: string;
  member: User[];
  bookName: string;
  userName: string;
  userImage: string;
  userId: number;
  issueUserId: number;
  book: Book[];
  bookList: number[];
  selectedBook: Choice[];
  choice: any[];
  bookId: number[];
  loadingbook = false;
  bookIssue: BookIssue[];
  userBookIssue:BookIssueList[];
  hasBookissu:boolean=false;
  returnDate: string;
  selectBook: boolean = false;
  url = fileUpload;
  totalFineOfUser: number = 0;
  p: number = 1;

  constructor(
    private memberSearch: UserService,
    private bookService: BookService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.bookList = [];
    this.choice = [];
    this.bookId = [];
    this.userId = null;
    this.searchBook(this.bookName);
  }

  ngOnInit() {}

  getUserId(id, firstName, lastName, userImage) {
    this.userId = id;
    this.userName = firstName + lastName;
    this.userImage = userImage;
    this.getAllFineList(id);
    //console.log(  this.userId, this.userName, this.userImage, this.url);

  }
  getUserIssue(userId){
    console.log(userId);
    this.bookService.perticularUserBookIssuList(userId).subscribe(data=>{
      console.log(data);
      this.userBookIssue = data;
    },err=>{
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    })
  }

  getBookId(book_id: number, title: string, checkBook) {
    // console.log(checkBook.checked, this.choice);
    this.selectedBook = [];
    console.log(this.choice.length)
    if (checkBook.checked) {// if checked true
      // already exist
      this.selectBook = true;
      for (let i = 0; i < this.choice.length; i++) {
        if (this.choice[i]['book_id'] === book_id) {
            this.choice.splice(i, 1);
            this.bookId.splice(i, 1);
            break;
        }
      }
      // not exist
      this.selectedBook['book_id'] = book_id;
      this.selectedBook['book_name'] = title;
      this.choice.push(this.selectedBook);
      this.bookId.push(this.selectedBook['book_id']);
    } else {
      for (let i = 0; i < this.choice.length; i++) {
        if (this.choice[i]['book_id'] === book_id) {
            this.choice.splice(i, 1);
            this.bookId.splice(i, 1);
            break;
        }
      }

    }
  }

  getAllFineList(id){
    this.loadingbook = true;
    this.memberSearch.getAllFine().subscribe(finedata => {
      let total=0;
      for(let i=0;i<finedata.length;i++){
        if(finedata[i]['user_id']=== id){
          if(finedata[i]['status'] === 0) total  = total + 	finedata[i]['fine_amount'];
        }
      }
      this.loadingbook = false;
      this.totalFineOfUser = total;
      this.openSnackBar("Success", "ok");
    }, error => {
      this.loadingbook = false;
      this.openSnackBar("Error"+error.error.message, "ok")
      console.log(error);
    });
  }

  searchMember(memberName) {
    this.loadingbook = true;
    this.memberSearch.searchMember(memberName).subscribe(data => {
      this.loadingbook = false;
      this.member = data;
    }, err => {
      this.loadingbook = false;
      console.log(err);
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

  searchBook(bookName) {
    this.loadingbook = true;
    this.bookService.bookSearch(bookName,1).subscribe(data => {
      this.loadingbook = false;
      this.book = data;
      console.log(this.book);
    }, err => {
      this.loadingbook = false;
      if(err.status == 400) location.reload(true);
      this.openSnackBar('Error: ' + err.error, 'ok');
      console.log(err);
    });
  }

  issueBook() {
    this.loadingbook = true;
    this.bookService.libraryBookIssue(this.bookIssue).subscribe(res => {
      this.loadingbook = false;
      this.openSnackBar('Successfully load ', 'ok');
      this.router.navigate(['view-book-issue-list']);
    }, err => {
      this.loadingbook = false;
      console.log(err);
      if(err.error.message)this.openSnackBar('' + err.error.message, 'ok');
      if(err.error.return_date)this.openSnackBar('' + err.error.return_date, 'ok');
    });
  }

  onBookSubmit() {
    this.searchBook(this.bookName);
  }

  onMemberSubmit() {
    this.searchMember(this.memberName);
  }

  onBookIssueSubmit() {
    console.log(this.userId, this.bookId, this.returnDate);
    this.bookIssue = [];
    this.bookIssue['user_id'] = this.userId;
    this.bookIssue['book_id'] = this.bookId;
    this.bookIssue['return_date'] = this.returnDate;
    console.log(this.bookIssue);
    this.issueBook();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 8000,
    });
  }

  remove_select(book_id) {
    let index = 0;
    // console.log(this.choice);
    for (let i = 0; i < this.choice.length; i++) {
      if (this.choice[i]['book_id'] === book_id) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this.choice.splice(index, 1);
      this.bookId.splice(index, 1);
    }
  }

}
