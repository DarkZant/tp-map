document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const alternativeList = button.nextElementSibling;
        alternativeList.style.display = 
            alternativeList.style.display === 'none' ? 'block' : 'none';
    });
});