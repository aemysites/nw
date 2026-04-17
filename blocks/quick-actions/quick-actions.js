export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    // First cell has heading + description, second cell has the action

    // Build card structure
    row.classList.add('quick-actions-card');

    if (cells.length >= 2) {
      const headingCell = cells[0];
      const actionCell = cells[1];
      headingCell.classList.add('quick-actions-info');
      actionCell.classList.add('quick-actions-action');

      // Check if action cell contains a list (dropdown pattern)
      const list = actionCell.querySelector('ul');
      if (list) {
        // Convert list to a select dropdown + Go button
        const items = [...list.querySelectorAll('li a')];
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'What would you like to do?');
        items.forEach((a) => {
          const option = document.createElement('option');
          option.value = a.href;
          option.textContent = a.textContent;
          select.appendChild(option);
        });

        const goBtn = document.createElement('button');
        goBtn.type = 'button';
        goBtn.textContent = 'Go';
        goBtn.classList.add('quick-actions-go');
        goBtn.addEventListener('click', () => {
          window.open(select.value, '_blank');
        });

        actionCell.innerHTML = '';
        actionCell.appendChild(select);
        actionCell.appendChild(goBtn);
      }

      // Check if it's the "Find agent" card (has link with agent search)
      const agentLink = actionCell.querySelector('a[href*="agency.nationwide"]');
      if (agentLink) {
        const form = document.createElement('div');
        form.classList.add('quick-actions-agent-form');

        const input = document.createElement('input');
        input.type = 'tel';
        input.placeholder = 'ZIP Code';
        input.maxLength = 10;
        input.setAttribute('aria-label', 'Enter Zip');
        input.classList.add('quick-actions-zip');

        const goBtn = document.createElement('button');
        goBtn.type = 'button';
        goBtn.textContent = 'Go';
        goBtn.classList.add('quick-actions-go');
        goBtn.addEventListener('click', () => {
          const zip = input.value.trim();
          if (zip) {
            window.open(`https://agency.nationwide.com/search?q=${encodeURIComponent(zip)}`, '_blank');
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') goBtn.click();
        });

        form.appendChild(input);
        form.appendChild(goBtn);

        actionCell.innerHTML = '';
        actionCell.appendChild(form);
      }
    }
  });
}
