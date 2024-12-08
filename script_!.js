document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const messages = document.getElementById("messages");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const senderSelect = document.getElementById("senderSelect");
    const attachFileBtn = document.getElementById("attachFileBtn");
    const fileInput = document.getElementById("fileInput");
  
    const groupModal = document.getElementById("groupModal");
    const editGroupBtn = document.getElementById("editGroupBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
  
    const groupNameElement = document.getElementById("groupName");
    const groupNameInput = document.getElementById("groupNameInput");
    const groupProfilePictureInput = document.getElementById("groupProfilePictureInput");
    const groupProfilePicture = document.getElementById("groupProfilePicture");
  
    const groupMembersList = document.getElementById("groupMembersList");
    const newMemberName = document.getElementById("newMemberName");
    const newMemberContact = document.getElementById("newMemberContact");
    const newMemberPicture = document.getElementById("newMemberPicture");
    const addMemberBtn = document.getElementById("addMemberBtn");
  
    // Local Storage Keys
    const GROUP_DETAILS_KEY = "groupDetails";
    const MESSAGES_KEY = "messages";
  
    // Load Group and Messages Data
    let groupDetails = JSON.parse(localStorage.getItem(GROUP_DETAILS_KEY)) || {
      name: "Group Name",
      picture: "group-placeholder.png",
      members: [],
    };
    let messagesData = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  
    // Save to Local Storage
    const saveGroupDetails = () => localStorage.setItem(GROUP_DETAILS_KEY, JSON.stringify(groupDetails));
    const saveMessages = () => localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesData));
  
    // Render Group Details
    const renderGroupDetails = () => {
      groupNameElement.textContent = groupDetails.name;
      groupProfilePicture.src = groupDetails.picture || "group-placeholder.png";
      groupNameInput.value = groupDetails.name;
      groupMembersList.innerHTML = "";
  
      senderSelect.innerHTML = '<option value="">Select Member</option>';
      groupDetails.members.forEach((member, index) => {
        // Populate Members List in Modal
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${member.picture || 'user-placeholder.png'}" alt="Avatar" class="member-pic">
          <span>${member.name} (${member.contact})</span>
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        groupMembersList.appendChild(li);
  
        // Populate Sender Selection
        const option = document.createElement("option");
        option.value = member.name;
        option.textContent = member.name;
        senderSelect.appendChild(option);
      });
    };
  
    // Render Messages
    const renderMessages = () => {
      messages.innerHTML = "";
      messagesData.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", msg.sender === "Me" ? "right" : "left");
  
        const bubbleDiv = document.createElement("div");
        bubbleDiv.classList.add("bubble");
        bubbleDiv.textContent = msg.text;
  
        const avatar = document.createElement("img");
        avatar.src = msg.picture || "user-placeholder.png";
        avatar.alt = "Avatar";
  
        messageDiv.appendChild(msg.sender === "Me" ? bubbleDiv : avatar);
        messageDiv.appendChild(msg.sender === "Me" ? avatar : bubbleDiv);
  
        messages.appendChild(messageDiv);
      });
  
      messages.scrollTop = messages.scrollHeight; // Scroll to latest message
    };
  
    // Add Member
    addMemberBtn.addEventListener("click", () => {
      const name = newMemberName.value.trim();
      const contact = newMemberContact.value.trim();
      const picture = newMemberPicture.files[0]
        ? URL.createObjectURL(newMemberPicture.files[0])
        : "user-placeholder.png";
  
      if (!name || !contact) {
        alert("Please fill in all member details.");
        return;
      }
  
      groupDetails.members.push({ name, contact, picture });
      saveGroupDetails();
      renderGroupDetails();
      newMemberName.value = "";
      newMemberContact.value = "";
      newMemberPicture.value = "";
    });
  
    // Remove Member
    groupMembersList.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const index = e.target.dataset.index;
        groupDetails.members.splice(index, 1);
        saveGroupDetails();
        renderGroupDetails();
      }
    });
  
    // Send Message
    sendBtn.addEventListener("click", () => {
      const sender = senderSelect.value;
      const text = messageInput.value.trim();
  
      if (!sender || !text) {
        alert("Please select a sender and type a message.");
        return;
      }
  
      const senderDetails = groupDetails.members.find((member) => member.name === sender);
      const message = {
        sender,
        text,
        picture: senderDetails ? senderDetails.picture : "user-placeholder.png",
      };
  
      messagesData.push(message);
      saveMessages();
      renderMessages();
      messageInput.value = "";
    });
  
    // File Attachment
    attachFileBtn.addEventListener("click", () => fileInput.click());
  
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File selected: ${file.name}`);
      }
    });
  
    // Group Modal Logic
    editGroupBtn.addEventListener("click", () => {
      groupModal.classList.add("active");
      groupModal.style.animation = "slideIn 0.3s forwards";
    });
  
    closeModalBtn.addEventListener("click", () => {
      groupModal.style.animation = "slideOut 0.3s forwards";
      setTimeout(() => groupModal.classList.remove("active"), 300);
    });
  
    // Update Group Name and Picture
    groupNameInput.addEventListener("input", (e) => {
      groupDetails.name = e.target.value;
      saveGroupDetails();
      renderGroupDetails();
    });
  
    groupProfilePictureInput.addEventListener("change", (e) => {
      if (e.target.files[0]) {
        groupDetails.picture = URL.createObjectURL(e.target.files[0]);
        saveGroupDetails();
        renderGroupDetails();
      }
    });
  
    // Initial Render
    renderGroupDetails();
    renderMessages();
  });
document.addEventListener("DOMContentLoaded", () => {
  const splitDetailsBtn = document.getElementById("splitDetailsBtn");
  const splitDetailsModal = document.getElementById("splitDetailsModal");
  const closeSplitModalBtn = document.getElementById("closeSplitModalBtn");
  const payerSelect = document.getElementById("payerSelect");
  const eventDescription = document.getElementById("eventDescription");
  const totalAmount = document.getElementById("totalAmount");
  const shareWithList = document.getElementById("shareWithList");
  const calculateSplitBtn = document.getElementById("calculateSplitBtn");

  const members = JSON.parse(localStorage.getItem("groupDetails")).members || [];

  // Populate Payer Dropdown and Share List
  const populateMembers = () => {
    payerSelect.innerHTML = '<option value="">Select Member</option>';
    shareWithList.innerHTML = "";
    members.forEach((member, index) => {
      // Populate dropdown
      const option = document.createElement("option");
      option.value = member.name;
      option.textContent = member.name;
      payerSelect.appendChild(option);

      // Populate share list
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = member.name;
      checkbox.id = `member-${index}`;

      const label = document.createElement("label");
      label.textContent = member.name;
      label.htmlFor = `member-${index}`;

      const div = document.createElement("div");
      div.appendChild(checkbox);
      div.appendChild(label);

      shareWithList.appendChild(div);
    });
  };

  // Show Split Modal
  splitDetailsBtn.addEventListener("click", () => {
    splitDetailsModal.classList.add("active");
    populateMembers();
  });

  // Close Split Modal
  closeSplitModalBtn.addEventListener("click", () => {
    splitDetailsModal.classList.remove("active");
  });

  // Calculate Split
  calculateSplitBtn.addEventListener("click", () => {
    const payer = payerSelect.value;
    const description = eventDescription.value.trim();
    const amount = parseFloat(totalAmount.value);
    const shareWith = Array.from(
      shareWithList.querySelectorAll("input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.value);

    if (!payer || !description || isNaN(amount) || shareWith.length === 0) {
      alert("Please fill in all fields.");
      return;
    }

    const splitAmount = (amount / (shareWith.length + 1)).toFixed(2); // +1 for payer
    const message = `${payer} owes money from ${shareWith.join(", ")} for ${description} (Amount: ₹${splitAmount} each).`;

    // Add message to chat
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.textContent = message;
    document.getElementById("messages").appendChild(newMessage);

    // Generate TXT File
    const blob = new Blob([message], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "split-details.txt";
    link.click();

    // Close Modal
    splitDetailsModal.classList.remove("active");
  });
});
  