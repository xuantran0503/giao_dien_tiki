HUONG DAN LAM VIEC NHOM 2 NGUOI VOI GIT

Tai lieu huong dan cach lam viec nhom 2 nguoi voi Git/GitHub. Phu hop cho do an, bai tap nhom hoac du an nho.

==================================================

I. MO HINH LAM VIEC

- 1 repository chung tren GitHub
- Nhanh main: code on dinh
- Moi nguoi lam viec tren nhanh rieng
- Gop code bang Pull Request (PR)

==================================================

II. PHAN VAI

- Nguoi A: tao repository, quan ly nhanh main
- Nguoi B: clone repo, code tren nhanh rieng

==================================================

III. HUONG DAN CHI TIET

PHAN A – NGUOI A (TAO REPO)

Buoc A1: Tao repository tren GitHub
1. Vao GitHub -> New repository
2. Dat ten repo (vi du: tiki-clone)
3. Khong chon README neu da co code

Buoc A2: Push code len GitHub

Lenh:

git init
git branch -M main
git remote add origin https://github.com/USERNAME/tiki-clone.git
git add .
git commit -m "init project"
git push -u origin main

Buoc A3: Them nguoi B vao repo
- GitHub -> Settings -> Collaborators
- Add GitHub username cua nguoi B
- Nguoi B accept invite

Buoc A4: Tao nhanh rieng de code

git checkout -b xuan-fe

==================================================

PHAN B – NGUOI B (CLONE & CODE)

Buoc B1: Clone repository

git clone https://github.com/USERNAME/tiki-clone.git
cd tiki-clone

Buoc B2: Tao nhanh rieng

git checkout -b teammate-be

==================================================

IV. QUY TRINH LAM VIEC HANG NGAY (CA HAI NGUOI)

Buoc 1: Keo code moi nhat tu main

git checkout main
git pull origin main
git checkout <ten-nhanh-ca-nhan>
git merge main

Buoc 2: Code phan duoc phan cong

Buoc 3: Commit code

git add .
git commit -m "feat: mo ta ngan gon viec da lam"

Buoc 4: Push nhanh len GitHub

git push origin <ten-nhanh-ca-nhan>

==================================================

V. GOP CODE (PULL REQUEST)

1. Vao GitHub -> New Pull Request
2. Chon:
   from: nhanh ca nhan
   to: main
3. Nguoi con lai review code
4. Merge Pull Request

==================================================

VI. SAU KHI MERGE (CA HAI NGUOI)

git checkout main
git pull origin main

==================================================

VII. LUAT KHI LAM VIEC NHOM

- Khong commit truc tiep len main
- Luon pull main truoc khi code
- Commit nho, ro rang
- Tranh sua cung mot file lon cung luc

==================================================

VIII. TOM TAT

- Moi nguoi mot nhanh
- Code -> commit -> push -> PR -> merge
- Main luon la code on dinh

==================================================

END FILE
