import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Search, Upload, Eye, X, HelpCircle } from 'lucide-react'
import AdminLayout from '~/components/layout/AdminLayout'
import { apiService } from '~/config/axios'
import type {
  Course,
  CoursesListResponse,
  CourseLanguage,
  CourseLanguagesResponse,
  Lesson,
  LessonsListResponse,
  Question,
  QuestionsListResponse,
  Answer,
  CreateQuestionRequest,
  UpdateQuestionRequest
} from '~/types/course'

/* eslint-disable @typescript-eslint/no-explicit-any */

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(8)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [searchTitle, setSearchTitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // State cho Lessons Modal
  const [isLessonsModalOpen, setIsLessonsModalOpen] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // State cho Lesson CRUD
  const [isLessonFormModalOpen, setIsLessonFormModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    description: ''
  })
  const [lessonErrors, setLessonErrors] = useState({
    title: '',
    description: ''
  })

  // ==================== QUESTION STATE ====================
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // Question CRUD state
  const [isQuestionFormModalOpen, setIsQuestionFormModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionFormData, setQuestionFormData] = useState({
    content: '',
    answers: [{ content: '', isCorrect: false }]
  })
  const [questionErrors, setQuestionErrors] = useState({
    content: '',
    answers: ''
  })

  // ==================== BULK QUESTIONS STATE ====================
  const [isBulkQuestionsModalOpen, setIsBulkQuestionsModalOpen] = useState(false)
  const [bulkQuestionsData, setBulkQuestionsData] = useState<
    Array<{
      content: string
      answers: Array<{ content: string; isCorrect: boolean }>
    }>
  >([
    {
      content: '',
      answers: [{ content: '', isCorrect: false }]
    }
  ])
  const [bulkErrors, setBulkErrors] = useState<string>('')

  // State cho Course Languages
  const [courseLanguages, setCourseLanguages] = useState<CourseLanguage[]>([])
  const [loadingLanguages, setLoadingLanguages] = useState(false)

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    coin: '',
    courseLanguageId: ''
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    coin: 0,
    courseLanguageId: ''
  })

  const fetchCourses = async (page: number = 1, title: string = '') => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        Page: page,
        PageSize: pageSize
      }

      if (title && title.trim()) {
        params.Title = title.trim()
      }

      console.log('=== Fetching Courses ===')
      console.log('Params:', params)

      const response = await apiService.get<CoursesListResponse>('/courses', params)

      console.log('=== API Response ===')
      console.log('Response:', response)

      if (response.succeeded && response.data && Array.isArray(response.data)) {
        const data = response as unknown as CoursesListResponse
        // FORCE NEW REFERENCE với unique key
        const newCourses = data.data.map((course, idx) => ({
          ...course,
          _renderKey: `${course.courseId}-${page}-${idx}-${Date.now()}`
        }))

        setCourses(newCourses)
        setTotalPages(data.totalPages || 0)
        setTotalCount(data.totalCount || 0)
        setCurrentPage(page)

        console.log('=== Updated State ===')
        console.log('Page:', page)
        console.log('Courses:', newCourses.length)
      } else {
        console.error('Invalid response:', response)
        toast.error(response.message || 'Không thể tải danh sách khóa học')
        setCourses([])
        setTotalPages(0)
        setTotalCount(0)
      }
    } catch (error) {
      console.error('=== Error Fetching Courses ===', error)
      setCourses([])
      toast.error('Lỗi khi tải danh sách khóa học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses(1, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track courses changes
  useEffect(() => {
    console.log('=== Courses Updated ===')
    console.log(
      'Courses:',
      courses.map((c) => ({ id: c.courseId, title: c.title }))
    )
  }, [courses])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== Searching ===')
    console.log('Search Title:', searchTitle)
    fetchCourses(1, searchTitle)
  }

  const handleReset = () => {
    console.log('=== Resetting ===')
    setSearchTitle('')
    fetchCourses(1, '')
  }

  // Function để fetch course languages
  const fetchCourseLanguages = async () => {
    setLoadingLanguages(true)
    try {
      const response = await apiService.get<CourseLanguagesResponse>('/course-languages')

      if (response.succeeded && response.data && Array.isArray(response.data)) {
        setCourseLanguages(response.data)
      } else {
        toast.error(response.message || 'Không thể tải danh sách ngôn ngữ')
        setCourseLanguages([])
      }
    } catch (error) {
      console.error('Error fetching course languages:', error)
      toast.error('Lỗi khi tải danh sách ngôn ngữ')
      setCourseLanguages([])
    } finally {
      setLoadingLanguages(false)
    }
  }

  // Function để fetch lessons
  const fetchLessons = async (courseId: string) => {
    setLoadingLessons(true)
    try {
      const response = await apiService.get<LessonsListResponse>(`/courses/${courseId}/lessons`, {
        Page: 1,
        PageSize: 100
      })

      if (response.succeeded && response.data && Array.isArray(response.data)) {
        setLessons(response.data)
      } else {
        toast.error(response.message || 'Không thể tải danh sách bài học')
        setLessons([])
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
      toast.error('Lỗi khi tải danh sách bài học')
      setLessons([])
    } finally {
      setLoadingLessons(false)
    }
  }

  // Function để mở modal lessons
  const handleViewLessons = async (course: Course) => {
    setSelectedCourse(course)
    setIsLessonsModalOpen(true)
    await fetchLessons(course.courseId)
  }

  // Lesson CRUD Functions
  const validateLessonForm = (): boolean => {
    const newErrors = {
      title: '',
      description: ''
    }

    let isValid = true

    if (!lessonFormData.title.trim()) {
      newErrors.title = 'Tên bài học không được để trống'
      isValid = false
    } else if (lessonFormData.title.trim().length < 3) {
      newErrors.title = 'Tên bài học phải có ít nhất 3 ký tự'
      isValid = false
    }

    if (!lessonFormData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống'
      isValid = false
    } else if (lessonFormData.description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự'
      isValid = false
    }

    setLessonErrors(newErrors)
    return isValid
  }

  const handleAddLesson = () => {
    setEditingLesson(null)
    setLessonFormData({
      title: '',
      description: ''
    })
    setLessonErrors({ title: '', description: '' })
    setIsLessonFormModalOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonFormData({
      title: lesson.title,
      description: lesson.description
    })
    setLessonErrors({ title: '', description: '' })
    setIsLessonFormModalOpen(true)
  }

  const handleSubmitLesson = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLessonForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    if (!selectedCourse) return

    setLoadingLessons(true)
    try {
      if (editingLesson) {
        // Update lesson
        const response = await apiService.put(`/lessons/${editingLesson.lessonId}`, {
          title: lessonFormData.title.trim(),
          description: lessonFormData.description.trim()
        })

        if (response.succeeded) {
          toast.success(response.message || 'Cập nhật bài học thành công')
          setIsLessonFormModalOpen(false)
          await fetchLessons(selectedCourse.courseId)
        } else {
          toast.error(response.message || 'Không thể cập nhật bài học')
        }
      } else {
        // Create new lesson
        const response = await apiService.post('/lessons', {
          title: lessonFormData.title.trim(),
          description: lessonFormData.description.trim(),
          courseId: selectedCourse.courseId
        })

        if (response.succeeded) {
          toast.success(response.message || 'Thêm bài học thành công')
          setIsLessonFormModalOpen(false)
          await fetchLessons(selectedCourse.courseId)
        } else {
          toast.error(response.message || 'Không thể thêm bài học')
        }
      }
    } catch (error) {
      console.error('Error submitting lesson:', error)
      toast.error(editingLesson ? 'Lỗi khi cập nhật bài học' : 'Lỗi khi thêm bài học')
    } finally {
      setLoadingLessons(false)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) return
    if (!selectedCourse) return

    setLoadingLessons(true)
    try {
      const response = await apiService.delete(`/lessons/${lessonId}`)

      console.log('Delete lesson response:', response)

      // Luôn reload danh sách sau khi xóa
      await fetchLessons(selectedCourse.courseId)

      // Kiểm tra response để hiển thị toast phù hợp
      if (response.succeeded || response.succeeded === undefined) {
        toast.success(response.message || 'Xóa bài học thành công')
      } else {
        // Nếu API báo lỗi nhưng vẫn xóa được thì hiển thị warning
        toast.warning('Bài học đã được xóa')
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
      // Vẫn reload để kiểm tra xem có thực sự xóa được không
      await fetchLessons(selectedCourse.courseId)
      toast.warning('Đã xóa bài học, vui lòng kiểm tra lại')
    } finally {
      setLoadingLessons(false)
    }
  }

  // ==================== QUESTION FUNCTIONS ====================
  const fetchQuestions = async (lessonId: string) => {
    setLoading(true)
    try {
      const response = await apiService.get<QuestionsListResponse>(`/lessons/${lessonId}/questions`, {
        Page: 1,
        PageSize: 100
      })
      if (response && (response as any).succeeded) {
        const data = response as unknown as QuestionsListResponse
        setQuestions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Không thể tải danh sách questions')
    } finally {
      setLoading(false)
    }
  }

  const handleViewQuestions = async (lesson: Lesson) => {
    setSelectedLesson(lesson)
    await fetchQuestions(lesson.lessonId)
    setIsQuestionsModalOpen(true)
  }

  const handleCloseQuestionsModal = () => {
    setIsQuestionsModalOpen(false)
    setSelectedLesson(null)
    setQuestions([])
  }

  const handleAddQuestion = () => {
    setQuestionFormData({
      content: '',
      answers: [{ content: '', isCorrect: false }]
    })
    setQuestionErrors({ content: '', answers: '' })
    setEditingQuestion(null)
    setIsQuestionFormModalOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setQuestionFormData({
      content: question.content,
      answers: question.answers.map((a) => ({
        content: a.content,
        isCorrect: a.isCorrect
      }))
    })
    setQuestionErrors({ content: '', answers: '' })
    setIsQuestionFormModalOpen(true)
  }

  const handleCloseQuestionFormModal = () => {
    setIsQuestionFormModalOpen(false)
    setEditingQuestion(null)
    setQuestionFormData({
      content: '',
      answers: [{ content: '', isCorrect: false }]
    })
    setQuestionErrors({ content: '', answers: '' })
  }

  const validateQuestionForm = () => {
    const newErrors = { content: '', answers: '' }
    if (!questionFormData.content.trim()) newErrors.content = 'Nội dung câu hỏi không được để trống'

    const validAnswers = questionFormData.answers.filter((a) => a.content.trim())
    if (validAnswers.length < 1) newErrors.answers = 'Cần ít nhất 1 câu trả lời'

    const hasCorrectAnswer = questionFormData.answers.some((a) => a.isCorrect && a.content.trim())
    if (!hasCorrectAnswer) newErrors.answers = 'Cần ít nhất 1 câu trả lời đúng'

    setQuestionErrors(newErrors)
    return !newErrors.content && !newErrors.answers
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateQuestionForm() || !selectedLesson) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    setLoading(true)
    try {
      const validAnswers = questionFormData.answers.filter((a) => a.content.trim())

      if (editingQuestion) {
        const updateData: UpdateQuestionRequest = {
          questionId: editingQuestion.questionId,
          content: questionFormData.content.trim(),
          lessonId: selectedLesson.lessonId,
          answers: validAnswers.map((a) => ({
            content: a.content.trim(),
            isCorrect: a.isCorrect
          }))
        }

        console.log('=== UPDATE Question Payload ===')
        console.log('Update Data:', JSON.stringify(updateData, null, 2))

        const response = await apiService.put(`/questions/${editingQuestion.questionId}`, updateData as any)
        if (response && (response as any).succeeded) {
          toast.success('Cập nhật question thành công')
          handleCloseQuestionFormModal()
          fetchQuestions(selectedLesson.lessonId)
        } else {
          toast.error((response as any).message || 'Cập nhật question thất bại')
        }
      } else {
        const createData = {
          content: questionFormData.content.trim(),
          lessonId: selectedLesson.lessonId,
          answers: validAnswers.map((a) => ({
            content: a.content.trim(),
            isCorrect: a.isCorrect
          }))
        }

        console.log('=== CREATE Question Payload ===')
        console.log('Create Data:', JSON.stringify([createData], null, 2))
        console.log('Lesson ID:', selectedLesson.lessonId)
        console.log('Valid Answers Count:', validAnswers.length)

        // Backend expects an ARRAY of questions, not a single object!
        const response = await apiService.post('/questions', [createData] as any)

        console.log('=== API Response ===')
        console.log('Response:', response)

        if (response && (response as any).succeeded) {
          toast.success('Tạo question thành công')
          handleCloseQuestionFormModal()
          fetchQuestions(selectedLesson.lessonId)
        } else {
          toast.error((response as any).message || 'Tạo question thất bại')
        }
      }
    } catch (error) {
      console.error('=== ERROR submitting question ===')
      console.error('Error:', error)
      if ((error as any).response) {
        console.error('Response data:', (error as any).response.data)
        console.error('Response status:', (error as any).response.status)
        console.error('Response headers:', (error as any).response.headers)

        // Hiển thị message cụ thể từ backend
        const errorMessage =
          (error as any).response.data?.message ||
          (error as any).response.data?.errors?.[0] ||
          (error as any).response.data?.title ||
          'Request failed with status code ' + (error as any).response.status
        toast.error(errorMessage)
      } else {
        toast.error(editingQuestion ? 'Cập nhật question thất bại' : 'Tạo question thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa question này?') || !selectedLesson) return

    setLoading(true)
    try {
      const response = await apiService.delete(`/questions/${questionId}`)
      if (response && (response as any).succeeded) {
        toast.success('Xóa question thành công')
        fetchQuestions(selectedLesson.lessonId)
      } else {
        toast.error((response as any).message || 'Xóa question thất bại')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Xóa question thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAnswer = () => {
    setQuestionFormData({
      ...questionFormData,
      answers: [...questionFormData.answers, { content: '', isCorrect: false }]
    })
  }

  const handleRemoveAnswer = (index: number) => {
    if (questionFormData.answers.length <= 1) {
      toast.error('Cần ít nhất 1 câu trả lời')
      return
    }
    const newAnswers = questionFormData.answers.filter((_, i) => i !== index)
    setQuestionFormData({ ...questionFormData, answers: newAnswers })
  }

  const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean) => {
    const newAnswers = [...questionFormData.answers]
    newAnswers[index] = { ...newAnswers[index], [field]: value }
    setQuestionFormData({ ...questionFormData, answers: newAnswers })
  }

  // ==================== BULK QUESTIONS FUNCTIONS ====================
  const handleOpenBulkQuestionsModal = () => {
    setBulkQuestionsData([
      {
        content: '',
        answers: [{ content: '', isCorrect: false }]
      }
    ])
    setBulkErrors('')
    setIsBulkQuestionsModalOpen(true)
  }

  const handleCloseBulkQuestionsModal = () => {
    setIsBulkQuestionsModalOpen(false)
    setBulkQuestionsData([
      {
        content: '',
        answers: [{ content: '', isCorrect: false }]
      }
    ])
    setBulkErrors('')
  }

  const handleAddBulkQuestion = () => {
    setBulkQuestionsData([
      ...bulkQuestionsData,
      {
        content: '',
        answers: [{ content: '', isCorrect: false }]
      }
    ])
  }

  const handleRemoveBulkQuestion = (questionIndex: number) => {
    if (bulkQuestionsData.length <= 1) {
      toast.error('Cần ít nhất 1 question')
      return
    }
    const newQuestions = bulkQuestionsData.filter((_, i) => i !== questionIndex)
    setBulkQuestionsData(newQuestions)
  }

  const handleBulkQuestionChange = (questionIndex: number, content: string) => {
    const newQuestions = [...bulkQuestionsData]
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], content }
    setBulkQuestionsData(newQuestions)
  }

  const handleAddBulkAnswer = (questionIndex: number) => {
    const newQuestions = [...bulkQuestionsData]
    newQuestions[questionIndex].answers.push({ content: '', isCorrect: false })
    setBulkQuestionsData(newQuestions)
  }

  const handleRemoveBulkAnswer = (questionIndex: number, answerIndex: number) => {
    if (bulkQuestionsData[questionIndex].answers.length <= 1) {
      toast.error('Cần ít nhất 1 câu trả lời')
      return
    }
    const newQuestions = [...bulkQuestionsData]
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex)
    setBulkQuestionsData(newQuestions)
  }

  const handleBulkAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    field: 'content' | 'isCorrect',
    value: string | boolean
  ) => {
    const newQuestions = [...bulkQuestionsData]
    newQuestions[questionIndex].answers[answerIndex] = {
      ...newQuestions[questionIndex].answers[answerIndex],
      [field]: value
    }
    setBulkQuestionsData(newQuestions)
  }

  const validateBulkQuestions = () => {
    for (let i = 0; i < bulkQuestionsData.length; i++) {
      const question = bulkQuestionsData[i]

      if (!question.content.trim()) {
        setBulkErrors(`Question ${i + 1}: Nội dung câu hỏi không được để trống`)
        return false
      }

      const validAnswers = question.answers.filter((a) => a.content.trim())
      if (validAnswers.length < 1) {
        setBulkErrors(`Question ${i + 1}: Cần ít nhất 1 câu trả lời`)
        return false
      }

      const hasCorrectAnswer = question.answers.some((a) => a.isCorrect && a.content.trim())
      if (!hasCorrectAnswer) {
        setBulkErrors(`Question ${i + 1}: Cần ít nhất 1 câu trả lời đúng`)
        return false
      }
    }

    setBulkErrors('')
    return true
  }

  const handleSubmitBulkQuestions = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateBulkQuestions() || !selectedLesson) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    setLoading(true)
    try {
      const questionsToCreate = bulkQuestionsData.map((q) => ({
        content: q.content.trim(),
        lessonId: selectedLesson.lessonId,
        answers: q.answers
          .filter((a) => a.content.trim())
          .map((a) => ({
            content: a.content.trim(),
            isCorrect: a.isCorrect
          }))
      }))

      console.log('=== BULK CREATE Questions Payload ===')
      console.log('Questions:', JSON.stringify(questionsToCreate, null, 2))
      console.log('Total Questions:', questionsToCreate.length)

      const response = await apiService.post('/questions', questionsToCreate as any)

      console.log('=== API Response ===')
      console.log('Response:', response)

      if (response && (response as any).succeeded) {
        toast.success(`Tạo ${questionsToCreate.length} questions thành công`)
        handleCloseBulkQuestionsModal()
        fetchQuestions(selectedLesson.lessonId)
      } else {
        toast.error((response as any).message || 'Tạo questions thất bại')
      }
    } catch (error) {
      console.error('=== ERROR submitting bulk questions ===')
      console.error('Error:', error)
      if ((error as any).response) {
        console.error('Response data:', (error as any).response.data)
        const errorMessage =
          (error as any).response.data?.message ||
          (error as any).response.data?.errors?.[0] ||
          'Request failed with status code ' + (error as any).response.status
        toast.error(errorMessage)
      } else {
        toast.error('Tạo questions thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLessonInputChange =
    (field: keyof typeof lessonFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setLessonFormData((prev) => ({
        ...prev,
        [field]: value
      }))

      if (lessonErrors[field]) {
        setLessonErrors((prev) => ({
          ...prev,
          [field]: ''
        }))
      }
    }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      title: '',
      description: '',
      price: '',
      coin: '',
      courseLanguageId: ''
    }

    let isValid = true

    if (!formData.title.trim()) {
      newErrors.title = 'Tên khóa học không được để trống'
      isValid = false
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Tên khóa học phải có ít nhất 3 ký tự'
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống'
      isValid = false
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự'
      isValid = false
    }

    if (!formData.courseLanguageId || !formData.courseLanguageId.trim()) {
      newErrors.courseLanguageId = 'Vui lòng chọn ngôn ngữ khóa học'
      isValid = false
    }

    const price = Number(formData.price)
    if (isNaN(price)) {
      newErrors.price = 'Giá phải là số'
      isValid = false
    } else if (price < 0) {
      newErrors.price = 'Giá không được âm'
      isValid = false
    }

    const coin = Number(formData.coin)
    if (isNaN(coin)) {
      newErrors.coin = 'Coin phải là số'
      isValid = false
    } else if (coin < 0) {
      newErrors.coin = 'Coin không được âm'
      isValid = false
    }

    if (price > 0 && coin > 0) {
      newErrors.price = 'Chỉ được chọn 1 trong 2: Giá hoặc Coin'
      newErrors.coin = 'Chỉ được chọn 1 trong 2: Giá hoặc Coin'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('Title', formData.title.trim())
      data.append('Description', formData.description.trim())
      data.append('Price', formData.price.toString())
      data.append('Coin', formData.coin.toString())
      data.append('CourseLanguageId', formData.courseLanguageId)

      if (imageFile) {
        data.append('Image', imageFile)
      }

      if (editingCourse) {
        // Sử dụng fetch để upload file với FormData
        const token = localStorage.getItem('token')
        const response = await fetch(`https://be.apileximonsystem.site/api/courses/${editingCourse.courseId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data
        })

        const result = await response.json()

        if (result.succeeded) {
          toast.success(result.message || 'Cập nhật khóa học thành công')
          setIsModalOpen(false)
          resetForm()
          await fetchCourses(currentPage, searchTitle)
        } else {
          toast.error(result.message || 'Không thể cập nhật khóa học')
        }
      } else {
        // Sử dụng fetch để upload file với FormData
        const token = localStorage.getItem('token')
        const response = await fetch('https://be.apileximonsystem.site/api/courses', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data
        })

        const result = await response.json()

        if (result.succeeded) {
          toast.success(result.message || 'Thêm khóa học thành công')
          setIsModalOpen(false)
          resetForm()
          await fetchCourses(1, searchTitle)
        } else {
          toast.error(result.message || 'Không thể thêm khóa học')
        }
      }
    } catch (error) {
      console.error('Error submitting course:', error)
      toast.error(editingCourse ? 'Lỗi khi cập nhật khóa học' : 'Lỗi khi thêm khóa học')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return

    setLoading(true)
    try {
      const response = await apiService.delete(`/courses/${courseId}`)

      console.log('Delete course response:', response)

      // Luôn reload danh sách sau khi xóa
      if (courses.length === 1 && currentPage > 1) {
        await fetchCourses(currentPage - 1, searchTitle)
      } else {
        await fetchCourses(currentPage, searchTitle)
      }

      // Kiểm tra response để hiển thị toast phù hợp
      if (response.succeeded || response.succeeded === undefined) {
        toast.success(response.message || 'Xóa khóa học thành công')
      } else {
        toast.warning('Khóa học đã được xóa')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      // Vẫn reload để kiểm tra xem có thực sự xóa được không
      if (courses.length === 1 && currentPage > 1) {
        await fetchCourses(currentPage - 1, searchTitle)
      } else {
        await fetchCourses(currentPage, searchTitle)
      }
      toast.warning('Đã xóa khóa học, vui lòng kiểm tra lại')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      coin: course.coin,
      courseLanguageId: course.courseLanguageId || ''
    })
    setImagePreview(course.imageUrl || '')
    setImageFile(null)
    setErrors({ title: '', description: '', price: '', coin: '', courseLanguageId: '' })
    setIsModalOpen(true)
    fetchCourseLanguages() // Load languages khi mở modal
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      coin: 0,
      courseLanguageId: ''
    })
    setImageFile(null)
    setImagePreview('')
    setEditingCourse(null)
    setErrors({ title: '', description: '', price: '', coin: '', courseLanguageId: '' })
  }

  const handlePageChange = (page: number) => {
    console.log('=== Changing Page ===')
    console.log('From:', currentPage, 'To:', page)
    console.log('Total Pages:', totalPages)

    if (page < 1 || page > totalPages) {
      console.log('Invalid page number')
      return
    }

    if (page === currentPage) {
      console.log('Same page, skipping')
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchCourses(page, searchTitle)
  }

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'price' || field === 'coin' ? Number(value) : value
      }))

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: ''
        }))
      }
    }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản lý Khóa học</h1>
            <p className='mt-2 text-gray-600'>Quản lý các khóa học trong hệ thống ({totalCount} khóa học)</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              fetchCourseLanguages()
              setIsModalOpen(true)
            }}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Thêm khóa học
          </button>
        </div>

        {/* Search Bar */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <form onSubmit={handleSearch} className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên khóa học...'
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>
            <button
              type='submit'
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Tìm kiếm
            </button>
            {searchTitle && (
              <button
                type='button'
                onClick={handleReset}
                className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Xóa lọc
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {loading && !courses.length ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : courses.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>Không tìm thấy khóa học nào</p>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        STT
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Hình ảnh
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tên khóa học
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Ngôn ngữ
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Giá
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Coin
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Trạng thái
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {courses.map((course, index) => (
                      <tr key={course._renderKey || course.courseId} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className='w-16 h-16 object-cover rounded'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/64?text=No+Image'
                            }}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-sm font-medium text-gray-900'>{course.title}</div>
                          <div className='text-sm text-gray-500 line-clamp-1'>{course.description}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {course.courseLanguageName ? (
                            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800'>
                              {course.courseLanguageName}
                            </span>
                          ) : (
                            <span className='text-gray-400 text-xs'>Chưa có</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {course.price > 0 ? `${course.price.toLocaleString()} VNĐ` : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {course.coin > 0 ? course.coin : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {course.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button
                            onClick={() => handleViewLessons(course)}
                            className='text-green-600 hover:text-green-900 mr-4'
                            title='Xem bài học'
                          >
                            <Eye className='w-5 h-5' />
                          </button>
                          <button
                            onClick={() => handleEdit(course)}
                            className='text-blue-600 hover:text-blue-900 mr-4'
                            title='Chỉnh sửa'
                          >
                            <Pencil className='w-5 h-5' />
                          </button>
                          <button
                            onClick={() => handleDelete(course.courseId)}
                            className='text-red-600 hover:text-red-900'
                            title='Xóa'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                  <div className='flex-1 flex justify-between sm:hidden'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Sau
                    </button>
                  </div>
                  <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Hiển thị <span className='font-medium'>{(currentPage - 1) * pageSize + 1}</span> đến{' '}
                        <span className='font-medium'>{Math.min(currentPage * pageSize, totalCount)}</span> trong tổng
                        số <span className='font-medium'>{totalCount}</span> khóa học
                      </p>
                    </div>
                    <div>
                      <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          Trước
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4'>{editingCourse ? 'Sửa khóa học' : 'Thêm khóa học'}</h2>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>
                    Tên khóa học <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className='mt-1 text-sm text-red-500'>{errors.title}</p>}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>
                    Mô tả <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    disabled={loading}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className='mt-1 text-sm text-red-500'>{errors.description}</p>}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>
                    Ngôn ngữ khóa học <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.courseLanguageId}
                    onChange={handleInputChange('courseLanguageId')}
                    disabled={loading || loadingLanguages}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.courseLanguageId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value=''>-- Chọn ngôn ngữ --</option>
                    {courseLanguages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {errors.courseLanguageId && <p className='mt-1 text-sm text-red-500'>{errors.courseLanguageId}</p>}
                  {loadingLanguages && <p className='mt-1 text-xs text-gray-500'>Đang tải danh sách ngôn ngữ...</p>}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>Hình ảnh</label>
                  <div className='flex items-center gap-4'>
                    <label className='flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors'>
                      <Upload size={20} />
                      <span>Chọn ảnh</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        disabled={loading}
                        className='hidden'
                      />
                    </label>
                    {imagePreview && (
                      <img src={imagePreview} alt='Preview' className='h-20 w-20 rounded-lg object-cover border' />
                    )}
                  </div>
                  <p className='mt-1 text-xs text-gray-500'>Chấp nhận: JPG, PNG. Tối đa 5MB</p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Giá (VNĐ) <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={handleInputChange('price')}
                    disabled={loading}
                    min='0'
                    step='1'
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className='mt-1 text-sm text-red-500'>{errors.price}</p>}
                  <p className='mt-1 text-xs text-gray-500'>Chỉ được chọn 1 trong 2: Giá hoặc Coin</p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Coin <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.coin}
                    onChange={handleInputChange('coin')}
                    disabled={loading}
                    min='0'
                    step='1'
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.coin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.coin && <p className='mt-1 text-sm text-red-500'>{errors.coin}</p>}
                  <p className='mt-1 text-xs text-gray-500'>Chỉ được chọn 1 trong 2: Giá hoặc Coin</p>
                </div>
              </div>

              <div className='flex gap-2 justify-end mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  disabled={loading}
                  className='px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
                >
                  {loading ? 'Đang xử lý...' : editingCourse ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal hiển thị lessons */}
      {isLessonsModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold'>Danh sách bài học - {selectedCourse?.title}</h2>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleAddLesson}
                  disabled={loadingLessons}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm'
                >
                  <Plus size={16} />
                  Thêm bài học
                </button>
                <button
                  onClick={() => {
                    setIsLessonsModalOpen(false)
                    setLessons([])
                    setSelectedCourse(null)
                  }}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {loadingLessons ? (
              <div className='flex items-center justify-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
              </div>
            ) : lessons.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 mb-4'>Khóa học này chưa có bài học nào</p>
                <button
                  onClick={handleAddLesson}
                  className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <Plus size={20} />
                  Thêm bài học đầu tiên
                </button>
              </div>
            ) : (
              <div className='space-y-3'>
                {lessons.map((lesson, index) => (
                  <div key={lesson.lessonId} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <span className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm'>
                            {index + 1}
                          </span>
                          <h3 className='font-semibold text-lg'>{lesson.title}</h3>
                        </div>
                        <p className='text-gray-600 text-sm ml-11 mb-3'>{lesson.description}</p>
                        <div className='flex items-center gap-4 ml-11'>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              lesson.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {lesson.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className='flex gap-2 ml-4'>
                        <button
                          onClick={() => handleViewQuestions(lesson)}
                          disabled={loadingLessons}
                          className='text-green-600 hover:text-green-900 transition-colors disabled:opacity-50'
                          title='Xem Questions'
                        >
                          <HelpCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          disabled={loadingLessons}
                          className='text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50'
                          title='Sửa'
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.lessonId)}
                          disabled={loadingLessons}
                          className='text-red-600 hover:text-red-900 transition-colors disabled:opacity-50'
                          title='Xóa'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => {
                  setIsLessonsModalOpen(false)
                  setLessons([])
                  setSelectedCourse(null)
                }}
                className='px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa lesson */}
      {isLessonFormModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4'>{editingLesson ? 'Sửa bài học' : 'Thêm bài học'}</h2>
            <form onSubmit={handleSubmitLesson}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Tên bài học <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={lessonFormData.title}
                    onChange={handleLessonInputChange('title')}
                    disabled={loadingLessons}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      lessonErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập tên bài học'
                  />
                  {lessonErrors.title && <p className='mt-1 text-sm text-red-500'>{lessonErrors.title}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Mô tả <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={lessonFormData.description}
                    onChange={handleLessonInputChange('description')}
                    disabled={loadingLessons}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      lessonErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập mô tả bài học'
                  />
                  {lessonErrors.description && <p className='mt-1 text-sm text-red-500'>{lessonErrors.description}</p>}
                </div>
              </div>

              <div className='flex gap-2 justify-end mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsLessonFormModalOpen(false)
                    setEditingLesson(null)
                    setLessonFormData({ title: '', description: '' })
                    setLessonErrors({ title: '', description: '' })
                  }}
                  disabled={loadingLessons}
                  className='px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loadingLessons}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
                >
                  {loadingLessons ? 'Đang xử lý...' : editingLesson ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions Modal */}
      {isQuestionsModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]'>
          <div className='bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>Danh sách Questions - {selectedLesson?.title}</h2>
                <p className='text-gray-600 text-sm mt-1'>{questions.length} questions</p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleOpenBulkQuestionsModal}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                >
                  <Plus className='w-5 h-5' />
                  Thêm Nhiều Questions
                </button>
                <button
                  onClick={handleAddQuestion}
                  className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                >
                  <Plus className='w-5 h-5' />
                  Thêm 1 Question
                </button>
                <button onClick={handleCloseQuestionsModal} className='text-gray-500 hover:text-gray-700'>
                  <X className='w-6 h-6' />
                </button>
              </div>
            </div>

            {loading ? (
              <div className='flex justify-center py-12'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              </div>
            ) : questions.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <HelpCircle className='w-16 h-16 mx-auto mb-4 opacity-50' />
                <p>Chưa có question nào</p>
                <p className='text-sm mt-2'>Click "Thêm Question" để tạo mới</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {questions.map((question, index) => (
                  <div key={question.questionId} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-gray-900 mb-2'>
                          <HelpCircle className='w-5 h-5 inline mr-2 text-blue-600' />
                          Câu {index + 1}: {question.content}
                        </h3>
                      </div>
                      <div className='flex gap-2 ml-4'>
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className='text-blue-600 hover:text-blue-900'
                          title='Chỉnh sửa'
                        >
                          <Pencil className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.questionId)}
                          className='text-red-600 hover:text-red-900'
                          title='Xóa'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </div>
                    </div>

                    <div className='ml-7 space-y-2'>
                      {question.answers.map((answer, ansIndex) => (
                        <div
                          key={answer.answerId}
                          className={`flex items-start gap-2 p-2 rounded ${
                            answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <span className='font-medium text-gray-600 text-sm'>
                            {String.fromCharCode(65 + ansIndex)}.
                          </span>
                          <span className='flex-1 text-gray-800'>{answer.content}</span>
                          {answer.isCorrect && <span className='text-green-600 font-semibold text-sm'>✓ Đúng</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      {isQuestionFormModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]'>
          <div className='bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {editingQuestion ? 'Chỉnh sửa Question' : 'Thêm Question'}
              </h2>
              <button onClick={handleCloseQuestionFormModal} className='text-gray-500 hover:text-gray-700'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion}>
              <div className='space-y-4'>
                {/* Question Content */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Nội dung câu hỏi <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={questionFormData.content}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, content: e.target.value })}
                    disabled={loading}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      questionErrors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập nội dung câu hỏi'
                  />
                  {questionErrors.content && <p className='mt-1 text-sm text-red-500'>{questionErrors.content}</p>}
                </div>

                {/* Answers */}
                <div>
                  <div className='flex justify-between items-center mb-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Câu trả lời <span className='text-red-500'>*</span> (Tối thiểu 1 câu)
                    </label>
                    <button
                      type='button'
                      onClick={handleAddAnswer}
                      disabled={loading}
                      className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50'
                    >
                      <Plus className='w-4 h-4' />
                      Thêm câu trả lời
                    </button>
                  </div>

                  <div className='space-y-3'>
                    {questionFormData.answers.map((answer, index) => (
                      <div key={index} className='flex gap-2 items-start'>
                        <span className='font-medium text-gray-600 mt-2 text-sm min-w-[24px]'>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <input
                          type='text'
                          value={answer.content}
                          onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                          disabled={loading}
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                          placeholder={`Câu trả lời ${index + 1}`}
                        />
                        <label className='flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors'>
                          <input
                            type='checkbox'
                            checked={answer.isCorrect}
                            onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                            disabled={loading}
                            className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                          />
                          <span className='text-sm text-gray-700 whitespace-nowrap'>Đúng</span>
                        </label>
                        {questionFormData.answers.length > 1 && (
                          <button
                            type='button'
                            onClick={() => handleRemoveAnswer(index)}
                            disabled={loading}
                            className='text-red-600 hover:text-red-800 p-2 disabled:opacity-50'
                            title='Xóa câu trả lời'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {questionErrors.answers && <p className='mt-2 text-sm text-red-500'>{questionErrors.answers}</p>}
                </div>
              </div>

              <div className='flex gap-2 justify-end mt-6'>
                <button
                  type='button'
                  onClick={handleCloseQuestionFormModal}
                  disabled={loading}
                  className='px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
                >
                  {loading ? 'Đang xử lý...' : editingQuestion ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Questions Modal */}
      {isBulkQuestionsModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]'>
          <div className='bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>Thêm Nhiều Questions - {selectedLesson?.title}</h2>
                <p className='text-gray-600 text-sm mt-1'>Tạo {bulkQuestionsData.length} questions cùng lúc</p>
              </div>
              <button onClick={handleCloseBulkQuestionsModal} className='text-gray-500 hover:text-gray-700'>
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmitBulkQuestions}>
              {/* Error Message */}
              {bulkErrors && (
                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                  {bulkErrors}
                </div>
              )}

              {/* Questions List */}
              <div className='space-y-6 mb-6'>
                {bulkQuestionsData.map((question, qIndex) => (
                  <div key={qIndex} className='border-2 border-gray-200 rounded-lg p-4 bg-gray-50'>
                    <div className='flex justify-between items-start mb-3'>
                      <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                        <HelpCircle className='w-5 h-5 text-purple-600' />
                        Câu hỏi {qIndex + 1}
                      </h3>
                      {bulkQuestionsData.length > 1 && (
                        <button
                          type='button'
                          onClick={() => handleRemoveBulkQuestion(qIndex)}
                          className='text-red-600 hover:text-red-800'
                          title='Xóa question'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      )}
                    </div>

                    {/* Question Content */}
                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Nội dung câu hỏi <span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        value={question.content}
                        onChange={(e) => handleBulkQuestionChange(qIndex, e.target.value)}
                        disabled={loading}
                        rows={2}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50'
                        placeholder={`Nhập nội dung câu hỏi ${qIndex + 1}`}
                      />
                    </div>

                    {/* Answers */}
                    <div>
                      <div className='flex justify-between items-center mb-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Câu trả lời <span className='text-red-500'>*</span>
                        </label>
                        <button
                          type='button'
                          onClick={() => handleAddBulkAnswer(qIndex)}
                          disabled={loading}
                          className='text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50'
                        >
                          <Plus className='w-4 h-4' />
                          Thêm đáp án
                        </button>
                      </div>

                      <div className='space-y-2'>
                        {question.answers.map((answer, aIndex) => (
                          <div key={aIndex} className='flex gap-2 items-start'>
                            <span className='font-medium text-gray-600 mt-2 text-sm min-w-[24px]'>
                              {String.fromCharCode(65 + aIndex)}.
                            </span>
                            <input
                              type='text'
                              value={answer.content}
                              onChange={(e) => handleBulkAnswerChange(qIndex, aIndex, 'content', e.target.value)}
                              disabled={loading}
                              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50'
                              placeholder={`Đáp án ${aIndex + 1}`}
                            />
                            <label className='flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                              <input
                                type='checkbox'
                                checked={answer.isCorrect}
                                onChange={(e) => handleBulkAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                                disabled={loading}
                                className='w-4 h-4 text-green-600 rounded focus:ring-green-500'
                              />
                              <span className='text-sm text-gray-700 whitespace-nowrap'>Đúng</span>
                            </label>
                            {question.answers.length > 1 && (
                              <button
                                type='button'
                                onClick={() => handleRemoveBulkAnswer(qIndex, aIndex)}
                                disabled={loading}
                                className='text-red-600 hover:text-red-800 p-2 disabled:opacity-50'
                                title='Xóa đáp án'
                              >
                                <Trash2 className='w-5 h-5' />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Question Button */}
              <div className='mb-6'>
                <button
                  type='button'
                  onClick={handleAddBulkQuestion}
                  disabled={loading}
                  className='w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  <Plus className='w-5 h-5' />
                  Thêm câu hỏi mới
                </button>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-2 justify-end'>
                <button
                  type='button'
                  onClick={handleCloseBulkQuestionsModal}
                  disabled={loading}
                  className='px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2'
                >
                  {loading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>Tạo {bulkQuestionsData.length} Questions</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default CourseManagement
