// hooks/useCourseProgress.ts
import { useState, useCallback } from 'react';
import { useApiClient } from '@/lib/api';
import { getDecryptedItem } from '@/utils/storageHelper';

export const useCourseProgress = (courseId: string | null, setCourse: React.Dispatch<React.SetStateAction<any | null>>) => {
    const api = useApiClient();
    const [courseProgress, setCourseProgress] = useState<any | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [submittingMCQ, setSubmittingMCQ] = useState(false);
    const [currentMCQChapter, setCurrentMCQChapter] = useState<any | null>(null);

    const getUserId = useCallback(() => {
        const user = getDecryptedItem('userId');
        return user;
    }, []);

    // Add this helper function to useCourseProgress.ts
    const loadProgressData = async () => {
        if (!courseId) return;

        try {
            const userId = getUserId();
            if (!userId) return;

            console.log('🔄 [FRONTEND] Loading progress data...');
            const progressResponse = await api.get(`progress/${courseId}/progress?user_id=${userId}`);

            if (progressResponse.success) {
                console.log('✅ [FRONTEND] Progress data loaded:', progressResponse.data);
                setCourseProgress(progressResponse.data.data);
            }
        } catch (error) {
            console.error('❌ [FRONTEND] Error loading progress:', error);
        }
    };

    // Add the missing handleLessonComplete function
    const handleLessonComplete = useCallback(async (lessonId: number, chapterId: number) => {
        if (!courseId) {
            console.error('Course ID is required');
            return false;
        }

        try {
            const userId = getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('🎯 [FRONTEND] Calling complete-lesson API:', {
                courseId,
                lessonId,
                chapterId,
                userId
            });

            const response = await api.post(`progress/${courseId}/complete-lesson`, {
                user_id: userId,
                lesson_id: lessonId,
                chapter_id: chapterId
            });

            console.log('🎯 [FRONTEND] Complete-lesson API response:', response);

            if (response.success) {
                console.log('✅ [FRONTEND] Lesson marked as completed successfully');

                // Update local state
                setCourse((prev: any) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        chapters: prev.chapters.map((chapter: any) => {
                            if (chapter.id === chapterId) {
                                return {
                                    ...chapter,
                                    lessons: chapter.lessons.map((lesson: any) =>
                                        lesson.id === lessonId
                                            ? { ...lesson, completed: true }
                                            : lesson
                                    )
                                };
                            }
                            return chapter;
                        })
                    };
                });

                // Reload progress data to get updated state
                console.log('🔄 [FRONTEND] Reloading progress data...');
                await loadProgressData();

                return true;
            } else {
                console.error('❌ [FRONTEND] Failed to mark lesson as completed:', response.error);
                return false;
            }
        } catch (error) {
            console.error('❌ [FRONTEND] handleLessonComplete Error:', error);
            return false;
        }
    }, [courseId, getUserId, api, setCourse]);

    // Fixed submitMCQTest function
    const submitMCQTest = useCallback(async () => {
        if (!currentMCQChapter || !courseId) {
            console.error('No MCQ chapter selected or course ID missing');
            return;
        }

        try {
            setSubmittingMCQ(true);
            const userId = getUserId();

            if (!userId) {
                throw new Error('User not authenticated');
            }

            console.log('Submitting MCQ:', {
                courseId,
                chapterId: currentMCQChapter.id,
                userAnswers
            });

            const response = await api.post(`progress/${courseId}/submit-mcq`, {
                user_id: userId,
                chapter_id: currentMCQChapter.id,
                answers: userAnswers
            });

            if (response.success) {
                console.log('MCQ submitted successfully:', response.data);

                const mcqResult = response.data.data; // This contains the actual result

                // ✅ FIX: Use the actual passed status from API response
                setCourse((prev: any) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        chapters: prev.chapters.map((chapter: any) =>
                            chapter.id === currentMCQChapter.id
                                ? {
                                    ...chapter,
                                    mcq_passed: mcqResult.passed, // Use actual result
                                    mcq_results: mcqResult // Store the full results
                                }
                                : chapter
                        )
                    };
                });

                // Update progress
                if (mcqResult) {
                    setCourseProgress(mcqResult);
                }

                // Show appropriate message based on result
                if (mcqResult.passed) {
                    alert('🎉 Congratulations! You passed the MCQ test!');
                } else {
                    alert(`❌ You scored ${mcqResult.score}% but need ${mcqResult.passing_threshold}% to pass. You can reattempt the test.`);
                }

                // Close modal and reset
                setCurrentMCQChapter(null);
                setUserAnswers({});

            } else {
                console.error('Failed to submit MCQ:', response.error);
                alert(response.error?.message || 'Failed to submit MCQ');
            }
        } catch (error) {
            console.error('[submitMCQTest] Error:', error);
            alert('Error submitting MCQ. Please try again.');
        } finally {
            setSubmittingMCQ(false);
        }
    }, [currentMCQChapter, courseId, userAnswers, getUserId, api, setCourse, setCourseProgress]);

    const handleStartMCQ = useCallback((chapter: any) => {
        setCurrentMCQChapter(chapter);
        setUserAnswers({});
    }, []);

    const handleCloseMCQ = useCallback(() => {
        setCurrentMCQChapter(null);
        setUserAnswers({});
    }, []);

    const initializeProgress = useCallback((progress: any) => {
        setCourseProgress(progress);
    }, []);

    return {
        courseProgress,
        setCourseProgress,
        userAnswers,
        setUserAnswers,
        submittingMCQ,
        currentMCQChapter,
        handleLessonComplete, // ✅ Now included in return
        submitMCQTest,
        handleStartMCQ,
        handleCloseMCQ,
        initializeProgress,
        getUserId,
        loadProgressData, // Also include this if needed
    };
};