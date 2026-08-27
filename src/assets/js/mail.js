const forms = document.querySelectorAll("#modal form, #consult-modal, #modal2 form");
if (forms) {
  forms.forEach(form => {
    form.addEventListener("submit", function () {
      event.preventDefault();
      const formData = new FormData(this);
      const parent = this.closest('.modal');
      const feedback = document.querySelector('#feedback');
      for(const key of formData.entries()) {
        console.log(key);
      }
  
      this.reset();
      const haveText = document.querySelectorAll('.havetext')
      if (haveText.length) {
        haveText.forEach(el => {
          el.classList.remove('havetext')
        })
      }
  
      if (parent && parent.classList.contains('modal-with-feedback')) {
        parent.classList.add('--sended');
        return;
      }
  
      if (parent && 'closeModal' in parent) {
        parent.closeModal()
      } 
      console.log(feedback)
      if (feedback && 'openModal' in feedback) {
        feedback.openModal()
      }
    });
  })

}
