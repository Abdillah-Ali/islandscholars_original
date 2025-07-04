package com.islandscholars.repository;

import com.islandscholars.entity.Notification;
import com.islandscholars.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);
    List<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead);
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);
}