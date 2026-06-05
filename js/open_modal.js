$(function() {
  $(".pay-chkBtn").click(ele => {
    // var formData = $("#fmr02").serialize(); // 폼 데이터를 직렬화
    $.ajax({
      type: "POST",
      url: "/shop/paymentCheck.php",
      data: {
        'order_no': ele.target.dataset.no
      },
      success: function(response) {
        $('#paymentCheck__wrap').html(response);
  
        //리뷰 상세보기 모달
        $(".pay-modal, .modal-dimmed.pay__").show();
        $('html, body').css('overflow', 'hidden');
      },
      error: function() {
        console.error("데이터 전송 중 오류가 발생했습니다.");
      }
    });
  });
  
  $(".review-writeBtn").click(ele => {
    $.ajax({
      type: "POST",
      url: "/writeReview.php",
      data: {
        'order_no': ele.target.dataset.no,
      },
      success: function(response) {
        $('#writeReview__wrap').html(response);
  
        //후기 작성 상세보기 모달
        $(".review-modal.write__, .modal-dimmed.write__").show();
        $('html, body').css('overflow', 'hidden');
      },
      error: function() {
        console.error("데이터 전송 중 오류가 발생했습니다.");
      }
    });
  });
  
  $(document).on('click', '.write-chkBtn', ele => {
//    console.log(ele.target);
    $.ajax({
      type: "POST",
      url: "/reviewModal.php",
      data: {
        'review_id': ele.target.dataset.review_id,
      },
      success: function(response) {
        $('#reviewModal__wrap').html(response);
  
        //후기 작성 상세보기 모달
        $(".review-modal.view__, .modal-dimmed.view__").show();
        $('html, body').css('overflow', 'hidden');
      },
      error: function() {
        console.error("데이터 전송 중 오류가 발생했습니다.");
      }
    });
  });

  $(document).on('click', '.write-chkBtn .user-info, .write-chkBtn .issue-date, .write-chkBtn .post', function(event) {
    event.stopPropagation(); // 이벤트 전파 막기
    $(this).closest(".write-chkBtn").trigger("click"); // 상위 요소의 클릭 이벤트 수동으로 트리거
  });

  $('.likeBtn').click(ele => {
		/*GblMsgBox('프로그램 준비중입니다.');
		return;*/

    $.ajax({
      type: "POST",
      url: "/module/wish.php",
      data: {
        'club_id':  $('.likeBtn').attr('data-cid')
      },
      success: function(response) {
        if (response === 'ADD_SUCCESS') {
          ele.target.classList.add('color-primary');
          GblMsgBox('찜 목록에 추가하였습니다.');
        } else if (response === 'CANCEL_SUCCESS') {
          ele.target.classList.remove('color-primary');
          return;
        } else if (response == 'FAILED') {
          GblMsgBox('점검 중 입니다.');
        } else if (response == 'WRONG_ACCESS') {
          alert('잘못된 접근입니다.');
        } else if (response == 'REQUIRED_LOGIN') {
          alert('로그인이 필요한 서비스 입니다.');
          $(".total-menu").click();
        } else {
          alert('오류가 발생했습니다.');
          console.error('점검 중 입니다.');
        }
      },
      error: function() {
        console.error("데이터 전송 중 오류가 발생했습니다.");
      }
    });
  });

  /*
  $('.cartBtn').click(ele => {
    $.ajax({
      type: "POST",
      url: "/module/wish.php",
      data: {
        'club_id':  $('.likeBtn').attr('data-cid')
      },
      success: function(response) {
        if (response === 'ADD_SUCCESS') {
          ele.target.classList.add('color-primary');
          GblConfirmBox('장바구니에 추가하였습니다.\n장바구니로 이동하실?', '/shop/cart.php');
        } else if (response === 'CANCEL_SUCCESS') {
          ele.target.classList.remove('color-primary');
          return;
        } else if (response == 'FAILED') {
          GblMsgBox('점검 중 입니다.');
        } else if (response == 'WRONG_ACCESS') {
          alert('잘못된 접근입니다.');
        } else if (response == 'REQUIRED_LOGIN') {
          alert('로그인이 필요한 서비스 입니다.');
          $(".total-menu").click();
        } else {
          alert('오류가 발생했습니다.');
          console.error('점검 중 입니다.');
        }
      },
      error: function() {
        console.error("데이터 전송 중 오류가 발생했습니다.");
      }
    });
  })
*/
});